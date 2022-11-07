import { BotWeaponGenerator } from "@spt-aki/generators/BotWeaponGenerator";
import { BotGeneratorHelper } from "@spt-aki/helpers/BotGeneratorHelper";
import { BotWeaponGeneratorHelper } from "@spt-aki/helpers/BotWeaponGeneratorHelper";
import { ItemHelper } from "@spt-aki/helpers/ItemHelper";
import { WeightedRandomHelper } from "@spt-aki/helpers/WeightedRandomHelper";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";
import { InventoryMagGen } from "@spt-aki/generators/weapongen/InventoryMagGen";
import { IInventoryMagGen } from "@spt-aki/generators/weapongen/IInventoryMagGen";
import { Inventory as PmcInventory } from "@spt-aki/models/eft/common/tables/IBotBase";
import { Inventory, ModsChances } from "@spt-aki/models/eft/common/tables/IBotType";
import { GenerateWeaponResult } from "@spt-aki/models/spt/bots/GenerateWeaponResult";
import { inject, injectable, injectAll } from "tsyringe";
import {container, DependencyContainer} from "tsyringe";
@injectable()
export class CustomBotWeaponGenerator extends BotWeaponGenerator
{
    constructor(
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("WeightedRandomHelper") protected weightedRandomHelper: WeightedRandomHelper,
        @inject("BotGeneratorHelper") protected botGeneratorHelper: BotGeneratorHelper,
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("BotWeaponGeneratorHelper") protected botWeaponGeneratorHelper: BotWeaponGeneratorHelper,
        @injectAll("InventoryMagGen") protected inventoryMagGenComponents: IInventoryMagGen[]
    )
    {
        super(jsonUtil,logger,hashUtil,databaseServer,itemHelper,weightedRandomHelper,botGeneratorHelper,randomUtil,configServer,botWeaponGeneratorHelper,inventoryMagGenComponents);
    }

    public pickWeightedWeaponTplFromPool_1(equipmentSlot: string, WeaponType): string
    {
            if (equipmentSlot == "Holster"){
                const WeaponDatabasepath = "../db/botgen/weaponTypes/handguns.json"
                const WeaponDatabase = require(WeaponDatabasepath)
                const weaponPool = WeaponDatabase;
                return this.pickFromRelativeProbability(weaponPool)
            }
            if (equipmentSlot != "Holster"){
                const WeaponDatabasepath = "../db/botgen/weaponTypes/" + WeaponType + ".json"
                const WeaponDatabase = require(WeaponDatabasepath)
                const weaponPool = WeaponDatabase;
                return this.pickFromRelativeProbability(weaponPool)
            }
     }
  

    public pickFromRelativeProbability(Array) {
        let RelativeProbabilities = [];
        var ObjLength = Object.keys(Array)
        var i = -1
        for (const [key, value] of Object.entries(Array)) {
            i = i + 1 
            RelativeProbabilities[i] = value + (RelativeProbabilities[i - 1] || 0);
          }
          const maxCumulativeWeight = RelativeProbabilities[RelativeProbabilities.length - 1];
          const randomNumber = maxCumulativeWeight * Math.random();
          
          for (let itemIndex = 0; itemIndex < ObjLength.length; itemIndex += 1) {
            if (RelativeProbabilities[itemIndex] >= randomNumber) {
              return ObjLength[itemIndex]
            }
          }
    }


    public getPresetWeaponMods_c(weaponTpl, equipmentSlot, weaponParentId, itemTemplate, botRole) {
        // Invalid weapon generated, fallback to preset
        const weaponMods = [];
        // TODO: Right now, preset weapons trigger a lot of warnings regarding missing ammo in magazines & such
        let preset;
        for (const presetObj of Object.values(this.databaseServer.getTables().globals.ItemPresets)) {
            if (presetObj._items[0]._tpl === weaponTpl) {
                preset = this.jsonUtil.clone(presetObj);
                break;
            }
        }
        if (preset) {
            const parentItem = preset._items[0];
            preset._items[0] = {
                ...parentItem, ...{
                    "parentId": weaponParentId,
                    "slotId": equipmentSlot,
                    ...this.botGeneratorHelper.generateExtraPropertiesForItem(itemTemplate, botRole)
                }
            };
            weaponMods.push(...preset._items);
        }
        else {
            throw new Error(`Could not find preset for weapon with tpl ${weaponTpl}`);
        }
        return weaponMods;
    }

    public generateWeaponByTpl_custom(sessionId, weaponTpl, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc) {
        const modPool = botTemplateInventory.mods;
        const weaponItemTemplate = this.itemHelper.getItem(weaponTpl)[1];
        const weaponArray = this.getPresetWeaponMods_c(weaponTpl, equipmentSlot, weaponParentId, weaponItemTemplate, botRole);
        const b = weaponArray
        var obj = Object.values(b)
        var stringified = JSON.stringify(b)
        const newID = JSON.stringify(this.hashUtil.generate())
        const ogID = JSON.stringify(obj[0]._id)
        const finalString = stringified.replaceAll(ogID,newID)
        const finalObject = JSON.parse(finalString)
        if (!weaponItemTemplate) {
            this.logger.error(`Could not find item template with tpl ${weaponTpl}`);
            this.logger.error(`WeaponSlot -> ${equipmentSlot}`);
            return;
        }
        // Find ammo to use when filling magazines/chamber
        if (!botTemplateInventory.Ammo) {
            this.logger.error(`No ammo found for bot type ${botRole}`);
            throw new Error("bot generation failed");
        }
        const ammoTpl = this.getWeightedCompatibleAmmo(botTemplateInventory.Ammo, weaponItemTemplate);
        for (const magazine of finalObject.filter(x => x.slotId === this.modMagazineSlotId)) {
            this.fillExistingMagazines(finalObject, magazine, ammoTpl);
        }
        return {
            weapon: finalObject,
            chosenAmmo: ammoTpl,
            weaponMods: modPool,
            weaponTemplate: weaponItemTemplate
        };
    }

    public generateRandomWeapon1(sessionId: string, equipmentSlot: string, botTemplateInventory: Inventory, weaponParentId: string, modChances: ModsChances, botRole: string, isPmc: boolean): GenerateWeaponResult
    {
        //const weaponTpl = this.pickWeightedWeaponTplFromPool_1(equipmentSlot);
        
                const weapontypeFile = require("../db/botgen/WeaponTypes.json")
                const weapontype = this.pickFromRelativeProbability(weapontypeFile)
                const weaponTpl1 = this.pickWeightedWeaponTplFromPool_1(equipmentSlot, weapontype);
                const b = this.generateWeaponByTpl_custom(sessionId, weaponTpl1, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc);
                return b;

        
    }
}




