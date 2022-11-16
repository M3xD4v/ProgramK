import { BotGeneratorHelper } from "@spt-aki/helpers/BotGeneratorHelper";
import { BotInventoryGenerator } from "@spt-aki/generators/BotInventoryGenerator";
import { WeightedRandomHelper } from "@spt-aki/helpers/WeightedRandomHelper";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";
import { BotLootGenerator } from "@spt-aki/generators/BotLootGenerator";
import { BotWeaponGenerator } from "@spt-aki/generators/BotWeaponGenerator";
import { inject, injectable, injectAll } from "tsyringe";
import { EquipmentSlots } from "@spt-aki/models/enums/EquipmentSlots";
import { Inventory as PmcInventory } from "@spt-aki/models/eft/common/tables/IBotBase";
import { Chances, Generation, Inventory, Mods } from "@spt-aki/models/eft/common/tables/IBotType";

@injectable()
export class CustomBotInventoryGenerator extends BotInventoryGenerator {
    constructor(
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("BotWeaponGenerator") protected botWeaponGenerator: BotWeaponGenerator,
        @inject("BotLootGenerator") protected botLootGenerator: BotLootGenerator,
        @inject("BotGeneratorHelper") protected botGeneratorHelper: BotGeneratorHelper,
        @inject("WeightedRandomHelper") protected weightedRandomHelper: WeightedRandomHelper,
        @inject("ConfigServer") protected configServer: ConfigServer,
    ) {
        super(logger, hashUtil, randomUtil, databaseServer, botWeaponGenerator, botLootGenerator, botGeneratorHelper, weightedRandomHelper, configServer);
    }
    protected PMCgenerateEquipment(equipmentSlot: string, equipmentPool: Record<string, number>, modPool: Mods, spawnChances: Chances, botRole: string, inventory: PmcInventory): void
    {
        const spawnChance = ([EquipmentSlots.POCKETS, EquipmentSlots.SECURED_CONTAINER] as string[]).includes(equipmentSlot)
            ? 100
            : spawnChances.equipment[equipmentSlot];
        if (typeof spawnChance === "undefined")
        {
            this.logger.warning(`No spawn chance was defined for ${equipmentSlot}`);
            return;
        }

        const shouldSpawn = this.randomUtil.getIntEx(100) <= spawnChance;
        if (Object.keys(equipmentPool).length && shouldSpawn)
        {
            const id = this.hashUtil.generate();
            const equipmentItemTpl = this.weightedRandomHelper.getWeightedInventoryItem(equipmentPool);
            const itemTemplate = this.databaseServer.getTables().templates.items[equipmentItemTpl];

            if (!itemTemplate)
            {
                this.logger.error(`Could not find item template with tpl ${equipmentItemTpl}`);
                this.logger.info(`EquipmentSlot -> ${equipmentSlot}`);
                return;
            }

            if (this.botGeneratorHelper.isItemIncompatibleWithCurrentItems(inventory.items, equipmentItemTpl, equipmentSlot))
            {
                // Bad luck - randomly picked item was not compatible with current gear
                return;
            }

            const item = {
                "_id": id,
                "_tpl": equipmentItemTpl,
                "parentId": inventory.equipment,
                "slotId": equipmentSlot,
                ...this.botGeneratorHelper.generateExtraPropertiesForItem(itemTemplate, botRole)
            };


            const botEquipmentRole = this.botGeneratorHelper.getBotEquipmentRole(botRole);
            if (this.botConfig.equipment[botEquipmentRole] && this.botConfig.equipment[botEquipmentRole].randomisedArmorSlots?.includes(equipmentSlot))
            {
                this.botGeneratorHelper.generateDynamicModPool(itemTemplate, modPool, this.botConfig.equipment[botEquipmentRole].blacklist, botEquipmentRole);
            }

            if (Object.keys(modPool).includes(equipmentItemTpl))
            {
                const items = this.botGeneratorHelper.generateModsForEquipment([item], modPool, id, itemTemplate, spawnChances.mods, botRole);
                inventory.items.push(...items);
            }
            else
            {
                inventory.items.push(item);
            }
        }
    }
    public generateInventory_custom(sessionId: string, templateInventory: Inventory, equipmentChances: Chances, itemGenerationLimitsMinMax: Generation, botRole: string, isPmc: boolean, Class: string, Tier: string): PmcInventory {
        // Generate base inventory with no items
        const botInventory = this.generateInventoryBase();
        // Go over all defined equipment slots and generate an item for each of them
        const excludedSlots: string[] = [
            EquipmentSlots.FIRST_PRIMARY_WEAPON,
            EquipmentSlots.SECOND_PRIMARY_WEAPON,
            EquipmentSlots.HOLSTER,
            EquipmentSlots.ARMOR_VEST
        ];

        if (isPmc) {
            let ClassEquipment = require("../db/botgen/Classes/" + require("../db/botgen/Class.json").Classes[Class].equipment + "/equipment.json");
            let templateEquipment = this.botWeaponGenerator.pickFromRelativeProbability(ClassEquipment[Tier])
            //let templateEquipment = this.pickFromRelativeProbability(ClassEquipment["Tier" + Tier])
            let ChoosenEquipmentFile = require("../db/botgen/Classes/" + require("../db/botgen/Class.json").Classes[Class].equipment + "/equipment/" + Tier + "/" + templateEquipment + ".json")
            for (const equipmentSlot in templateInventory.equipment) {
                // Weapons have special generation and will be generateClassd seperately; ArmorVest should be generated after TactivalVest
                if (excludedSlots.includes(equipmentSlot)) {
                    continue;
                }
                this.generateEquipment(equipmentSlot, ChoosenEquipmentFile[equipmentSlot], templateInventory.mods, equipmentChances, botRole, botInventory);
            }
            // ArmorVest is generated afterwards to ensure that TacticalVest is always first, in case it is incompatible
            this.generateEquipment(EquipmentSlots.ARMOR_VEST, ChoosenEquipmentFile.ArmorVest, templateInventory.mods, equipmentChances, botRole, botInventory);

        } else {

            for (const equipmentSlot in templateInventory.equipment) {
                // Weapons have special generation and will be generated seperately; ArmorVest should be generated after TactivalVest
                if (excludedSlots.includes(equipmentSlot)) {
                    continue;
                }
                this.generateEquipment(equipmentSlot, templateInventory.equipment[equipmentSlot], templateInventory.mods, equipmentChances, botRole, botInventory);
            }
            // ArmorVest is generated afterwards to ensure that TacticalVest is always first, in case it is incompatible
            this.generateEquipment(EquipmentSlots.ARMOR_VEST, templateInventory.equipment.ArmorVest, templateInventory.mods, equipmentChances, botRole, botInventory);

        }


        // Roll weapon spawns and generate a weapon for each roll that passed
        const shouldSpawnPrimary = this.randomUtil.getIntEx(100) <= equipmentChances.equipment.FirstPrimaryWeapon;
        const weaponSlotSpawns = [{
                slot: EquipmentSlots.FIRST_PRIMARY_WEAPON,
                shouldSpawn: shouldSpawnPrimary
            },
            { // Only roll for a chance at secondary if primary roll was successful
                slot: EquipmentSlots.SECOND_PRIMARY_WEAPON,
                shouldSpawn: shouldSpawnPrimary ? this.randomUtil.getIntEx(100) <= equipmentChances.equipment.SecondPrimaryWeapon : false
            },
            { // Roll for an extra pistol, unless primary roll failed - in that case, pistol is guaranteed
                slot: EquipmentSlots.HOLSTER,
                shouldSpawn: shouldSpawnPrimary ? this.randomUtil.getIntEx(100) <= equipmentChances.equipment.Holster : true
            }
        ];

        for (const weaponSlot of weaponSlotSpawns) {
            if (weaponSlot.shouldSpawn && Object.keys(templateInventory.equipment[weaponSlot.slot]).length) {
                this.addWeaponAndMagazinesToInventory(sessionId, weaponSlot, templateInventory, botInventory, equipmentChances, botRole, isPmc, itemGenerationLimitsMinMax);
            }
        }

        this.botLootGenerator.generateLoot(sessionId, templateInventory, itemGenerationLimitsMinMax.items, isPmc, botRole, botInventory, equipmentChances);

        return botInventory;
    }


    protected override addWeaponAndMagazinesToInventory(
        sessionId: string,
        weaponSlot: {
            slot: EquipmentSlots;shouldSpawn: boolean;
        },
        templateInventory: Inventory,
        botInventory: PmcInventory,
        equipmentChances: Chances,
        botRole: string,
        isPmc: boolean,
        itemGenerationLimitsMinMax: Generation): void {
        let generatedWeapon
        if (isPmc == true) {
            generatedWeapon = this.botWeaponGenerator.generateRandomWeapon1(
                sessionId,
                weaponSlot.slot,
                templateInventory,
                botInventory.equipment,
                equipmentChances.mods,
                botRole,
                isPmc);
        } else {
            generatedWeapon = this.botWeaponGenerator.generateRandomWeapon(
                sessionId,
                weaponSlot.slot,
                templateInventory,
                botInventory.equipment,
                equipmentChances.mods,
                botRole,
                isPmc);
        }
        botInventory.items.push(...generatedWeapon.weapon);
        this.botWeaponGenerator.addExtraMagazinesToInventory(generatedWeapon, itemGenerationLimitsMinMax.items.magazines, botInventory, botRole);
    }
}