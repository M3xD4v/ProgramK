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
export class CustomBotInventoryGenerator extends BotInventoryGenerator
{
    constructor(
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("BotWeaponGenerator") protected botWeaponGenerator: BotWeaponGenerator,
        @inject("BotLootGenerator") protected botLootGenerator: BotLootGenerator,
        @inject("BotGeneratorHelper") protected botGeneratorHelper: BotGeneratorHelper,
        @inject("WeightedRandomHelper") protected weightedRandomHelper: WeightedRandomHelper,
        @inject("ConfigServer") protected configServer: ConfigServer
    )
    {
        super(logger,hashUtil,randomUtil,databaseServer,botWeaponGenerator,botLootGenerator,botGeneratorHelper,weightedRandomHelper,configServer);
    }


    protected override addWeaponAndMagazinesToInventory(
        sessionId: string,
        weaponSlot: { slot: EquipmentSlots; shouldSpawn: boolean; },
        templateInventory: Inventory,
        botInventory: PmcInventory,
        equipmentChances: Chances,
        botRole: string,
        isPmc: boolean,
        itemGenerationLimitsMinMax: Generation): void
    {
        const generatedWeapon = this.botWeaponGenerator.generateRandomWeapon(
            sessionId,
            weaponSlot.slot,
            templateInventory,
            botInventory.equipment,
            equipmentChances.mods,
            botRole,
            isPmc);

        botInventory.items.push(...generatedWeapon.weapon);
        this.botWeaponGenerator.addExtraMagazinesToInventory(generatedWeapon, itemGenerationLimitsMinMax.items.magazines, botInventory, botRole);
    }


}
