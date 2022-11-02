import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {JsonUtil} from "@spt-aki/utils/JsonUtil";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { ILocaleGlobalBase } from "@spt-aki/models/spt/server/ILocaleBase";
import { CustomBotWeaponGenerator } from "./CustomBotWeaponGenerator";
import { CustomBotInventoryGenerator } from "./CustomBotInventoryGenerator";

import * as itemsToAdd from "../IDs/IDs.json";
import * as path from 'path';
import * as fs from 'fs';
import { Inventory } from "@spt-aki/models/eft/common/tables/IBotBase";
import { stringify } from "querystring";
import { HashUtil } from "@spt-aki/utils/HashUtil";


class Mod implements IPostDBLoadMod, IPreAkiLoadMod  {

    logger: ILogger
    DB: JSON

    modPath: string = path.normalize(path.join(__dirname, '..'));
    modConfig: JSON
    modConfigPrices: JSON
    modInterKConfig: JSON
    modInterKStock: JSON
    TraderName: string

    traderBase: JSON

    constructor() {
    }

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        //Loading Config
        this.modConfig = require("../config/config.json");
        this.modInterKConfig= require("../config/InterK.json");
        this.modConfigPrices = require("../config/Prices.json");
        this.modInterKStock = require("../config/TraderStock.json");
        this.TraderName = this.modConfig.TraderName;
        if (this.modConfig.ItemCustomColors == false)
        {        
            for(const key in itemsToAdd) {
            const ITM = itemsToAdd[key]
            if (ITM.id != "devPPSHMag" && ITM.id != "devround" && ITM.id != "devPPSH") {
                if (ITM.propOverrides !== undefined){
               if (Object.keys(ITM.propOverrides).length > 1 ){
                delete ITM.propOverrides["BackgroundColor"]
               }
               else {
                delete ITM.propOverrides
               }
            }
        }
        }}
        //Loading TraderBase
        let traderBasePath = this.modPath+"/db/base/base.json";
        if(fs.existsSync(traderBasePath)){
            this.traderBase = require(traderBasePath);
        }
        else{
            this.logger.error(this.TraderName +"required base.json missing in /db/base/");
        }

        this.logger.debug(`[${this.TraderName}] Loading... `);

        this.registerProfileImage(container);
        this.setupTraderUpdateTime(container);


        container.register<CustomBotWeaponGenerator>("CustomBotWeaponGenerator", CustomBotWeaponGenerator);
        container.register("BotWeaponGenerator", {useToken: "CustomBotWeaponGenerator"});
        container.register<CustomBotInventoryGenerator>("CustomBotInventoryGenerator", CustomBotInventoryGenerator);
        container.register("BotInventoryGenerator", {useToken: "CustomBotInventoryGenerator"});

    }



    public postDBLoad(container: DependencyContainer): void {
        const databaseModule = require("./databaseModule");
        const weaponImplementation = require("./weaponImplementation");
        const StocksOverhaul = require("./StocksOverhaul")
        const looseLoot = require("./looseLoot")
        const quests = require("./quests");
        const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
        const tables = databaseServer.getTables();
        const logger = container.resolve < ILogger > ("WinstonLogger");
        const database = databaseServer.getTables();
        const items = database.templates.items;
        const handbook = database.templates.handbook.Items;
        const global = database.locales.global;
        const cServer = container.resolve<ConfigServer>("ConfigServer");
        const ragfairConfig = cServer.getConfig<ITraderConfig>(ConfigTypes.RAGFAIR);
        ragfairConfig.traders.newTraderId = true

        // -------------------------
        const primaryType = {
            "assault_rifles" : 10,
            "assault_carbines" : 10,
            "light_machine_guns" : 10,
            "submachine_guns" : 10,
            "shotguns" : 10,
            "marksman_rifles" :10,
            "sniper_rifles" : 10,
            "grenade_launcher" : 0,
        }
        const test =  {
            "5448bd6b4bdc2dfc2f8b4569": 1,
            "56d59856d2720bd8418b456a": 1,
            "56e0598dd2720bb5668b45a6": 1,
            "571a12c42459771f627b58a0": 1,
            "576a581d2459771e7b1bc4f1": 1,
            "579204f224597773d619e051": 1,
            "5a17f98cfcdbcb0980087290": 1
          }
        function pickFromRelativeProbability(WeaponType) {
            let RelativeProbabilities = [];
            var ObjLength = Object.keys(WeaponType)
            var ObjTest = Object.entries(WeaponType)
            var i = -1
            for (const [key, value] of Object.entries(WeaponType)) {
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
          function pickWeightedWeaponTplFromPool_1(weapontype)
          {
             const WeaponDatabasepath = "../db/botgen/" + weapontype + ".json"
             const WeaponDatabase = require(WeaponDatabasepath)
              const weaponPool = WeaponDatabase;
              return pickFromRelativeProbability(weaponPool)
          }

          for (let i = 0; i < 12; i++) {
            logger.log(pickFromRelativeProbability(primaryType),"magenta")
          }



          let b = [
                {
                    "_id": "5c0d1ec986f77439512a1a80",
                    "_tpl": "5beed0f50db834001c062b12",
                    "upd": {
                        "Repairable": {
                            "Durability": 46,
                            "MaxDurability": 52
                        },
                        "Foldable": {
                            "Folded": false
                        },
                        "FireMode": {
                            "FireMode": "fullauto"
                        }
                    },
                    "parentId": "55e6fa47ba403096cb191157",
                    "slotId": "FirstPrimaryWeapon"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a81",
                    "_tpl": "5beec8ea0db834001a6f9dbf",
                    "parentId": "5c0d1ec986f77439512a1a80",
                    "slotId": "mod_pistol_grip"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a82",
                    "_tpl": "5beec91a0db834001961942d",
                    "parentId": "5c0d1ec986f77439512a1a80",
                    "slotId": "mod_reciever"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a83",
                    "_tpl": "5beec9450db83400970084fd",
                    "parentId": "5c0d1ec986f77439512a1a82",
                    "slotId": "mod_sight_rear"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a84",
                    "_tpl": "5bf3f59f0db834001a6fa060",
                    "parentId": "5c0d1ec986f77439512a1a83",
                    "slotId": "mod_sight_rear"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a85",
                    "_tpl": "5beec8b20db834001961942a",
                    "parentId": "5c0d1ec986f77439512a1a80",
                    "slotId": "mod_stock_001"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a86",
                    "_tpl": "5beec8c20db834001d2c465c",
                    "parentId": "5c0d1ec986f77439512a1a85",
                    "slotId": "mod_stock"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a87",
                    "_tpl": "5beec3e30db8340019619424",
                    "parentId": "5c0d1ec986f77439512a1a80",
                    "slotId": "mod_handguard"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a88",
                    "_tpl": "5beecbb80db834001d2c465e",
                    "parentId": "5c0d1ec986f77439512a1a87",
                    "slotId": "mod_mount_000"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a89",
                    "_tpl": "5beecbb80db834001d2c465e",
                    "parentId": "5c0d1ec986f77439512a1a87",
                    "slotId": "mod_mount_001"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a8a",
                    "_tpl": "5beec1bd0db834001e6006f3",
                    "parentId": "5c0d1ec986f77439512a1a80",
                    "slotId": "mod_barrel"
                },
                {
                    "_id": "5c0d1ec986f77439512a1a8b",
                    "_tpl": "5beec3420db834001b095429",
                    "parentId": "5c0d1ec986f77439512a1a8a",
                    "slotId": "mod_muzzle"
                }
            ]
    
    const hashUtil = container.resolve<HashUtil>("HashUtil");
    var obj = Object.values(b)
    var stringified = JSON.stringify(b)
    const newID = JSON.stringify(hashUtil.generate())
    const ogID = JSON.stringify(obj[0]._id)
    const finalString = stringified.replaceAll(ogID,newID)
    const finalObject = JSON.parse(finalString)
    console.log(finalObject)



//------------------------------------

        logger.log("Loading...", "cyan");
        const logo = 
        `
                                                                                 
      ▀███▀▀▀██▄                                                          ▀████▀ ▀███▀ 
        ██   ▀██▄                                                           ██   ▄█▀   
        ██   ▄██▀███▄███  ▄██▀██▄ ▄█▀████████▄███ ▄█▀██▄ ▀████████▄█████▄   ██ ▄█▀     
        ███████   ██▀ ▀▀ ██▀   ▀████  ██   ██▀ ▀▀██   ██   ██    ██    ██   █████▄     
        ██        ██     ██     ███████▀   ██     ▄█████   ██    ██    ██   ██  ███    
        ██        ██     ██▄   ▄███        ██    ██   ██   ██    ██    ██   ██   ▀██▄  
      ▄████▄    ▄████▄    ▀█████▀ ███████▄████▄  ▀████▀██▄████  ████  ████▄████▄   ███▄
                                 █▀     ██                                             
                                 ██████▀                                               
      
        `
        logger.log(logo, "cyan");
        const Prices = this.modConfigPrices
        for (const itemInJson in itemsToAdd) {
            if (itemsToAdd[itemInJson].id === undefined) {
                break;
            }
            this.createItemHandbookEntry(itemsToAdd[itemInJson].id, itemsToAdd[itemInJson].handbookID, Prices[itemInJson], handbook);
            this.createItem(itemsToAdd[itemInJson].id, itemsToAdd[itemInJson].cloneID, itemsToAdd[itemInJson].bundle, itemsToAdd[itemInJson].fullName, itemsToAdd[itemInJson].shortName, itemsToAdd[itemInJson].description, items, global);
        }

        databaseModule.execute()

        if (this.modConfig.ItemCustomColors == true) {
            logger.log("ProgramK: Custom item colors --- ENABLED", "magenta")
        } else {
            logger.log("ProgramK: Custom item colors --- DISABLED", "magenta")
        }
        
        if (this.modConfig.EnableExtraStockSlots == true) {
            StocksOverhaul.execute()
            logger.log("ProgramK: StocksOverhaul Module --- ENABLED", "magenta")
        } else {
            logger.log("ProgramK: StocksOverhaul Module --- DISABLED", "magenta")
        }


        weaponImplementation.execute()
        looseLoot.execute()
        quests.execute()
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");


        // Add the new trader to the trader lists in DatabaseServer
        tables.traders[this.traderBase._id] = {
            assort: this.getAssort(this.logger),
            base: jsonUtil.deserialize(jsonUtil.serialize(this.traderBase)) as ITraderBase
        };

        let dialoguePath = this.modPath+"/db/dialogue/dialogue.json";
        if(fs.existsSync(dialoguePath)){
            tables.traders[this.traderBase._id].dialogue = require(dialoguePath);
        }

        let questassortPath = this.modPath+"/db/questassort/questassort.json";
        if(fs.existsSync(questassortPath)){
            tables.traders[this.traderBase._id].questassort = require(questassortPath);
        }


        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as ILocaleGlobalBase[];
        for (const locale of locales) {
            locale.trading[this.traderBase._id] = {
                FullName: this.traderBase.surname,
                FirstName: this.traderBase.name,
                Nickname: this.traderBase.nickname,
                Location: this.traderBase.location,
                Description: this.traderBase.description
            };
        }
        /* */
        this.logger.debug(`[${this.TraderName}] Loaded`);

    }

    private getAssort(logger:ILogger): ITraderAssort{
        let assort: ITraderAssort = {
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        };
        let files = this.loadAssortFiles(this.modPath+"/db/assort/");
        let fileCount = files.length;

        if(fileCount == 0){
            this.logger.error(this.TraderName+": No Files in /db/assort/");
            return assort;
        }

        files.forEach(file => {
            assort = this.mergeAssorts(assort,file);
        });
        return assort;
    }

    private registerProfileImage(container: DependencyContainer): void {
        const resFolderPath = this.modPath+"/res/";

        // Register route pointing to the profile picture
        const imageRouter = container.resolve<ImageRouter>("ImageRouter");
        //let filename =this.traderBase.avatar.replace(".jpg","");

        let fileExt = ".jpg";
        if (path.extname(this.traderBase.avatar) == ".png")
        fileExt = ".png";

        let fileName = path.basename(this.traderBase.avatar);

        imageRouter.addRoute(this.traderBase.avatar.replace(fileExt,""),resFolderPath+fileName);
    }

    private setupTraderUpdateTime(container: DependencyContainer): void {
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const traderRefreshConfig: UpdateTime = {
            traderId: this.traderBase._id,
            seconds: this.modInterKConfig.TraderUpdateTimeInSec
        };
        traderConfig.updateTime.push(traderRefreshConfig);
    }

    private loadAssortFiles(filePath):Array<ITraderAssort>{
        const logger = container.resolve < ILogger > ("WinstonLogger");

        let fileNameList = fs.readdirSync(filePath);
        let fileList = [];
        fileNameList.forEach(fileName => {
            if (path.extname(fileName) == ".json"){
                let newFile = require(filePath+fileName) as ITraderAssort;
                fileList.push(newFile);
            }
        });
        return fileList;
    }

    private mergeAssorts(assort1: ITraderAssort,assort2: ITraderAssort): ITraderAssort{
		Object.values(assort2.items).map((item)=>{
            const logger = container.resolve < ILogger > ("WinstonLogger");

            if (item.upd){
                if (item.upd.UnlimitedCount && 2+2==3) {
                    function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['_id'] == id);})[0];}
                    const json = JSON.stringify(this.modInterKStock)
                    const sjson = JSON.parse(json)
                    var selectedObject = filterById(sjson['ITEM'], item._id);
                    var test = selectedObject
                    delete test['parentId']
                    delete test['slotId']
                    delete test['_tpl']
                    test.loyal_level_items = 1
                   // logger.log(JSON.stringify(test) + ",", "blue")
                }
                if (item.upd.UnlimitedCount) {

                    function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['_id'] == id);})[0];}
                        const json = JSON.stringify(this.modInterKStock)
                        const sjson = JSON.parse(json)
                        var selectedObject = filterById(sjson['ITEM'], item._id);
                        selectedObject.upd.StackObjectsCount = selectedObject.upd.StackObjectsCount * this.modInterKConfig.StockMultiplier
                        item.upd = selectedObject.upd
                       // logger.log(item.upd, "blue")
                       // logger.log(selectedObject.upd, "blue")

                }
            }

            assort1.items.push(item);
			if(item.parentId =="hideout"){  //check if its not part of a preset
                const IKConfig = this.modInterKConfig
                const indivItem = assort2.barter_scheme[item._id]
                const json = JSON.stringify(this.modInterKStock)
                const sjson = JSON.parse(json)
                function filterById(jsonObject, id) {return jsonObject.filter(function(jsonObject) {return (jsonObject['_id'] == id);})[0];}
                var selectedObject = filterById(sjson['ITEM'], item._id);
                indivItem[0][0].count = this.modConfigPrices[item._id]
                indivItem[0][0].count = indivItem[0][0].count * IKConfig.PriceMultiplier

               // logger.log(`"` +  item._id + `"` +":" + indivItem[0][0].count + `,` , "yellow")
				assort1.barter_scheme[item._id] = assort2.barter_scheme[item._id];
                if (this.modInterKConfig.BalancedLoyaltyLevels == true)
                {
                    assort1.loyal_level_items[item._id] = selectedObject.loyal_level_items
                }
				else {
                    assort1.loyal_level_items[item._id] = 1
                }
			}
		});
		return assort1;
	}

    addToFilters(db) {
        const isModFilterExist = (slots) => slots.findIndex((slot) => slot._name === "mod_scope");
        const isItemSlotsExist = (item) => item._props.Slots && item._props.Slots.length > 0;
        const filtersIncludeAttachment = (filterArray) => filterArray.includes("57ac965c24597706be5f975c");
        return filtersIncludeAttachment;
    }

    createItemHandbookEntry(i_id, i_category, i_fprice, i_handbook) {

        const logger = container.resolve < ILogger > ("WinstonLogger");


        i_handbook.push({
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice
        });

    }

    createItem(i_id, i_clone, i_path, i_lname, i_sname, i_desc, i_items, i_global) {
        const JsonUtil = container.resolve < JsonUtil > ("JsonUtil");
        const logger = container.resolve < ILogger > ("WinstonLogger");
        const item = JsonUtil.clone(i_items[i_clone]);



        item._id = i_id;
        item._props.Prefab.path = i_path;



        for (const propsToEdit in itemsToAdd[i_id].propOverrides) {
            item._props[propsToEdit] = itemsToAdd[i_id].propOverrides[propsToEdit];
        }



        for (const localeID in i_global) {
            i_global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            };
        }

        i_items[i_id] = item;

    }





}




module.exports = {
    mod: new Mod()
}
