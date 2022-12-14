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
/*
import { CustomBotWeaponGenerator } from "./CustomBotWeaponGenerator";
import { CustomBotInventoryGenerator } from "./CustomBotInventoryGenerator";
import { CustomBotGenerator } from "./CustomBotGenerator";
import { CustomBotController } from "./CustomBotController";
*/
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import * as itemsToAdd from "../IDs/IDs.json";
import * as path from 'path';
import * as fs from 'fs';


class Mod implements IPostDBLoadMod, IPreAkiLoadMod {

    logger: ILogger
    DB: JSON

    modPath: string = path.normalize(path.join(__dirname, '..'));
    modConfig: JSON
    modConfigPrices: JSON
    modInterKConfig: JSON
    modInterKStock: JSON
    TraderName: string

    traderBase: JSON

    constructor() {}

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve < ILogger > ("WinstonLogger");
        //Loading Config
        this.modConfig = require("../config/config.json");
        this.modInterKConfig = require("../config/InterK.json");
        this.modConfigPrices = require("../config/Prices.json");
        this.modInterKStock = require("../config/TraderStock.json");
        this.TraderName = this.modConfig.TraderName;

        if (this.modConfig.ProfileBackups == true) {
            this.logger.log("ProgramK: Profile backups --- ENABLED", "magenta")
            const logger = container.resolve < ILogger > ("WinstonLogger");
            const staticRouterModService = container.resolve < StaticRouterModService > ("StaticRouterModService");
            const profileHelper = container.resolve < ProfileHelper > ("ProfileHelper");
            var index = 0
            staticRouterModService.registerStaticRouter(
                "BackupRouter",
                [{
                    url: "/client/game/version/validate",
                    action: (url, info, sessionId, output) => {
                        const ProfileData = profileHelper.getFullProfile(sessionId)
                        const ProfileFileData = JSON.stringify(ProfileData, null, 4)
                        if (index == 0) {
                            index = 1
                            var pathF = this.modPath + "/BackUps/"
                            var pathforProfile = this.modPath + "/BackUps/" + ProfileData.info.id
                            if (fs.existsSync(pathforProfile)) {
                                var date = new Date()
                                var time = date.toLocaleTimeString();
                                var edit_time = time.replaceAll(" ", "_")
                                var edit_time2 = edit_time.replaceAll(":", "-")
                                var day = date.toISOString().slice(0, 10)
                                var combined = "_" + day + "_" + edit_time2

                                var backupName = pathforProfile + "/" + ProfileData.info.id + combined + ".json"
                                fs.writeFile(backupName, ProfileFileData, {
                                    encoding: "utf8",
                                    flag: "w",
                                    mode: 0o666
                                }, (err) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        logger.log(`Profile backup executed successfully: ${combined}`, "green")
                                    }
                                });

                            } else {
                                fs.mkdir(path.join(pathF, ProfileData.info.id), (err) => {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    logger.log("Backup path does not exist, creating folder....", "magenta")

                                });

                                var date = new Date()
                                var time = date.toLocaleTimeString();
                                var edit_time = time.replaceAll(" ", "_")
                                var edit_time2 = edit_time.replaceAll(":", "-")
                                var day = date.toISOString().slice(0, 10)
                                var combined = "_" + day + "_" + edit_time2

                                var backupName = pathforProfile + "/" + ProfileData.info.id + combined + ".json"
                                fs.writeFile(backupName, ProfileFileData, {
                                    encoding: "utf8",
                                    flag: "w",
                                    mode: 0o666
                                }, (err) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        logger.log(`Profile backup executed successfully: ${combined}`, "green")
                                    }
                                });
                            }
                        }
                        return output;
                    }
                }],
                "aki"
            );
        } else {
            this.logger.log("ProgramK: Profile backups --- DISABLED", "magenta")
        }

        if (this.modConfig.ItemCustomColors == false) {
            for (const key in itemsToAdd) {
                const ITM = itemsToAdd[key]
                if (ITM.id != "devPPSHMag" && ITM.id != "devround" && ITM.id != "devPPSH") {
                    if (ITM.propOverrides !== undefined) {
                        if (Object.keys(ITM.propOverrides).length > 1) {
                            delete ITM.propOverrides["BackgroundColor"]
                        } else {
                            delete ITM.propOverrides
                        }
                    }
                }
            }
        }
        //Loading TraderBase
        let traderBasePath = this.modPath + "/db/base/base.json";
        if (fs.existsSync(traderBasePath)) {
            this.traderBase = require(traderBasePath);
        } else {
            this.logger.error(this.TraderName + "required base.json missing in /db/base/");
        }

        this.logger.debug(`[${this.TraderName}] Loading... `);

        this.registerProfileImage(container);
        this.setupTraderUpdateTime(container);

         /*
        container.register<CustomBotWeaponGenerator>("CustomBotWeaponGenerator", CustomBotWeaponGenerator);
        container.register("BotWeaponGenerator", {useToken: "CustomBotWeaponGenerator"});
        
        container.register<CustomBotInventoryGenerator>("CustomBotInventoryGenerator", CustomBotInventoryGenerator);
        container.register("BotInventoryGenerator", {useToken: "CustomBotInventoryGenerator"});

        container.register<CustomBotGenerator>("CustomBotGenerator", CustomBotGenerator);
        container.register("BotGenerator", {useToken: "CustomBotGenerator"});

        container.register<CustomBotController>("CustomBotController", CustomBotController);
        container.register("BotController", {useToken: "CustomBotController"});
        */
    }



    public postDBLoad(container: DependencyContainer): void {
        const databaseModule = require("./databaseModule");
        const weaponImplementation = require("./weaponImplementation");
        const StocksOverhaul = require("./StocksOverhaul")
        const looseLoot = require("./looseLoot")
        const quests = require("./quests");
        const debug = require("./debug");
        const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
        const tables = databaseServer.getTables();
        const logger = container.resolve < ILogger > ("WinstonLogger");
        const database = databaseServer.getTables();
        const items = database.templates.items;
        const handbook = database.templates.handbook.Items;
        const global = database.locales.global;
        const cServer = container.resolve < ConfigServer > ("ConfigServer");
        const ragfairConfig = cServer.getConfig < ITraderConfig > (ConfigTypes.RAGFAIR);
        ragfairConfig.traders.newTraderId = true




        logger.log("Loading...", "cyan");
        const logo =
            `
                                                                                 
      ??????????????????????????????                                                          ?????????????????? ??????????????? 
        ??????   ????????????                                                           ??????   ?????????   
        ??????   ?????????????????????????????????  ????????????????????? ????????????????????????????????????????????? ?????????????????? ????????????????????????????????????????????????   ?????? ?????????     
        ?????????????????????   ????????? ?????? ?????????   ???????????????  ??????   ????????? ????????????   ??????   ??????    ??????    ??????   ??????????????????     
        ??????        ??????     ??????     ????????????????????????   ??????     ??????????????????   ??????    ??????    ??????   ??????  ?????????    
        ??????        ??????     ?????????   ????????????        ??????    ??????   ??????   ??????    ??????    ??????   ??????   ????????????  
      ??????????????????    ??????????????????    ????????????????????? ???????????????????????????????????????  ???????????????????????????????????????  ????????????  ??????????????????????????????   ????????????
                                 ??????     ??????                                             
                                 ?????????????????????                                               
      
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

        const jsonUtil = container.resolve < JsonUtil > ("JsonUtil");


        // Add the new trader to the trader lists in DatabaseServer
        tables.traders[this.traderBase._id] = {
            assort: this.getAssort(this.logger),
            base: jsonUtil.deserialize(jsonUtil.serialize(this.traderBase)) as ITraderBase
        };

        let dialoguePath = this.modPath + "/db/dialogue/dialogue.json";
        if (fs.existsSync(dialoguePath)) {
            tables.traders[this.traderBase._id].dialogue = require(dialoguePath);
        }

        let questassortPath = this.modPath + "/db/questassort/questassort.json";
        if (fs.existsSync(questassortPath)) {
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
        if (this.modConfig.DebugMode == true) {
            logger.log("ProgramK: Debug Mode --- ENABLED", "magenta")
            debug.execute()
        } else {
            logger.log("ProgramK: Debug Mode --- DISABLED", "magenta")
        }
    }

    private getAssort(logger: ILogger): ITraderAssort {
        let assort: ITraderAssort = {
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        };
        let files = this.loadAssortFiles(this.modPath + "/db/assort/");
        let fileCount = files.length;

        if (fileCount == 0) {
            this.logger.error(this.TraderName + ": No Files in /db/assort/");
            return assort;
        }

        files.forEach(file => {
            assort = this.mergeAssorts(assort, file);
        });
        return assort;
    }

    private registerProfileImage(container: DependencyContainer): void {
        const resFolderPath = this.modPath + "/res/";

        // Register route pointing to the profile picture
        const imageRouter = container.resolve < ImageRouter > ("ImageRouter");
        //let filename =this.traderBase.avatar.replace(".jpg","");

        let fileExt = ".jpg";
        if (path.extname(this.traderBase.avatar) == ".png")
            fileExt = ".png";

        let fileName = path.basename(this.traderBase.avatar);

        imageRouter.addRoute(this.traderBase.avatar.replace(fileExt, ""), resFolderPath + fileName);
    }

    private setupTraderUpdateTime(container: DependencyContainer): void {
        const configServer = container.resolve < ConfigServer > ("ConfigServer");
        const traderConfig = configServer.getConfig < ITraderConfig > (ConfigTypes.TRADER);
        const traderRefreshConfig: UpdateTime = {
            traderId: this.traderBase._id,
            seconds: this.modInterKConfig.TraderUpdateTimeInSec
        };
        traderConfig.updateTime.push(traderRefreshConfig);
    }

    private loadAssortFiles(filePath): Array < ITraderAssort > {
        const logger = container.resolve < ILogger > ("WinstonLogger");

        let fileNameList = fs.readdirSync(filePath);
        let fileList = [];
        fileNameList.forEach(fileName => {
            if (path.extname(fileName) == ".json") {
                let newFile = require(filePath + fileName) as ITraderAssort;
                fileList.push(newFile);
            }
        });
        return fileList;
    }

    private mergeAssorts(assort1: ITraderAssort, assort2: ITraderAssort): ITraderAssort {
        Object.values(assort2.items).map((item) => {
            const logger = container.resolve < ILogger > ("WinstonLogger");

            if (item.upd) {
                if (item.upd.UnlimitedCount && 2 + 2 == 3) {
                    function filterById(jsonObject, id) {
                        return jsonObject.filter(function(jsonObject) {
                            return (jsonObject['_id'] == id);
                        })[0];
                    }
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

                    function filterById(jsonObject, id) {
                        return jsonObject.filter(function(jsonObject) {
                            return (jsonObject['_id'] == id);
                        })[0];
                    }
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
            if (item.parentId == "hideout") { //check if its not part of a preset
                const IKConfig = this.modInterKConfig
                const indivItem = assort2.barter_scheme[item._id]
                const json = JSON.stringify(this.modInterKStock)
                const sjson = JSON.parse(json)

                function filterById(jsonObject, id) {
                    return jsonObject.filter(function(jsonObject) {
                        return (jsonObject['_id'] == id);
                    })[0];
                }
                var selectedObject = filterById(sjson['ITEM'], item._id);
                indivItem[0][0].count = this.modConfigPrices[item._id]
                indivItem[0][0].count = indivItem[0][0].count * IKConfig.PriceMultiplier

                // logger.log(`"` +  item._id + `"` +":" + indivItem[0][0].count + `,` , "yellow")
                assort1.barter_scheme[item._id] = assort2.barter_scheme[item._id];
                if (this.modInterKConfig.BalancedLoyaltyLevels == true) {
                    assort1.loyal_level_items[item._id] = selectedObject.loyal_level_items
                } else {
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
