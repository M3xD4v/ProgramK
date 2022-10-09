"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("../../../../node_modules/tsyringe");
const ConfigTypes_1 = require("../../../../Aki_data/Server/lib/models/enums/ConfigTypes");
const itemsToAdd = __importStar(require("../IDs/IDs.json"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class Mod {
    constructor() {
        this.modPath = path.normalize(path.join(__dirname, '..'));
    }
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        //Loading Config
        this.modConfig = require("../config/config.json");
        this.modInterKConfig = require("../config/InterK.json");
        this.modConfigPrices = require("../config/Prices.json");
        this.modInterKStock = require("../config/TraderStock.json");
        this.modName = this.modConfig.ModName;
        if (this.modConfig.ItemCustomColors == false) {
            for (const key in itemsToAdd) {
                const ITM = itemsToAdd[key];
                if (ITM.propOverrides !== undefined) {
                    if (Object.keys(ITM.propOverrides).length > 1) {
                        delete ITM.propOverrides["BackgroundColor"];
                    }
                    else {
                        delete ITM.propOverrides;
                    }
                }
            }
        }
        //Loading TraderBase
        let traderBasePath = this.modPath + "/db/base/base.json";
        if (fs.existsSync(traderBasePath)) {
            this.traderBase = require(traderBasePath);
        }
        else {
            this.logger.error(this.modName + "required base.json missing in /db/base/");
        }
        this.logger.debug(`[${this.modName}] Loading... `);
        this.registerProfileImage(container);
        this.setupTraderUpdateTime(container);
    }
    postDBLoad(container) {
        const databaseModule = require("./databaseModule");
        const weaponImplementation = require("./weaponImplementation");
        const StocksOverhaul = require("./StocksOverhaul");
        const looseLoot = require("./looseLoot");
        const quests = require("./quests");
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const logger = container.resolve("WinstonLogger");
        const database = databaseServer.getTables();
        const items = database.templates.items;
        const handbook = database.templates.handbook.Items;
        const global = database.locales.global;
        const cServer = container.resolve("ConfigServer");
        const ragfairConfig = cServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const questConfig = cServer.getConfig(ConfigTypes_1.ConfigTypes.QUEST);
        ragfairConfig.traders.newTraderId = true;
        const dailyquests = {
            "traderId": "newTraderId",
            "questTypes": [
                "Completion",
                "Exploration",
                "Elimination"
            ]
        };
        questConfig.repeatableQuests[0].traderWhitelist.push(dailyquests);
        logger.log("Program K Loaded", "yellow");
        const Prices = this.modConfigPrices;
        for (const itemInJson in itemsToAdd) {
            if (itemsToAdd[itemInJson].id === undefined) {
                break;
            }
            this.createItemHandbookEntry(itemsToAdd[itemInJson].id, itemsToAdd[itemInJson].handbookID, Prices[itemInJson], handbook);
            this.createItem(itemsToAdd[itemInJson].id, itemsToAdd[itemInJson].cloneID, itemsToAdd[itemInJson].bundle, itemsToAdd[itemInJson].fullName, itemsToAdd[itemInJson].shortName, itemsToAdd[itemInJson].description, items, global);
        }
        databaseModule.execute();
        StocksOverhaul.execute();
        weaponImplementation.execute();
        looseLoot.execute();
        quests.execute();
        const jsonUtil = container.resolve("JsonUtil");
        // Add the new trader to the trader lists in DatabaseServer
        tables.traders[this.traderBase._id] = {
            assort: this.getAssort(this.logger),
            base: jsonUtil.deserialize(jsonUtil.serialize(this.traderBase))
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
        const locales = Object.values(tables.locales.global);
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
        this.logger.debug(`[${this.modName}] Loaded`);
    }
    getAssort(logger) {
        let assort = {
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        };
        let files = this.loadAssortFiles(this.modPath + "/db/assort/");
        let fileCount = files.length;
        if (fileCount == 0) {
            this.logger.error(this.modName + ": No Files in /db/assort/");
            return assort;
        }
        files.forEach(file => {
            assort = this.mergeAssorts(assort, file);
        });
        this.logger.info(this.modName + ": Loaded " + fileCount + " files.");
        return assort;
    }
    registerProfileImage(container) {
        const resFolderPath = this.modPath + "/res/";
        // Register route pointing to the profile picture
        const imageRouter = container.resolve("ImageRouter");
        //let filename =this.traderBase.avatar.replace(".jpg","");
        let fileExt = ".jpg";
        if (path.extname(this.traderBase.avatar) == ".png")
            fileExt = ".png";
        let fileName = path.basename(this.traderBase.avatar);
        imageRouter.addRoute(this.traderBase.avatar.replace(fileExt, ""), resFolderPath + fileName);
    }
    setupTraderUpdateTime(container) {
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const traderRefreshConfig = {
            traderId: this.traderBase._id,
            seconds: this.modInterKConfig.TraderUpdateTimeInSec
        };
        traderConfig.updateTime.push(traderRefreshConfig);
    }
    loadAssortFiles(filePath) {
        const logger = tsyringe_1.container.resolve("WinstonLogger");
        let fileNameList = fs.readdirSync(filePath);
        let fileList = [];
        fileNameList.forEach(fileName => {
            if (path.extname(fileName) == ".json") {
                let newFile = require(filePath + fileName);
                fileList.push(newFile);
            }
        });
        return fileList;
    }
    mergeAssorts(assort1, assort2) {
        Object.values(assort2.items).map((item) => {
            const logger = tsyringe_1.container.resolve("WinstonLogger");
            if (item.upd) {
                if (item.upd.UnlimitedCount && 2 + 2 == 3) {
                    function filterById(jsonObject, id) { return jsonObject.filter(function (jsonObject) { return (jsonObject['_id'] == id); })[0]; }
                    const json = JSON.stringify(this.modInterKStock);
                    const sjson = JSON.parse(json);
                    var selectedObject = filterById(sjson['ITEM'], item._id);
                    var test = selectedObject;
                    delete test['parentId'];
                    delete test['slotId'];
                    delete test['_tpl'];
                    test.loyal_level_items = 1;
                    // logger.log(JSON.stringify(test) + ",", "blue") 
                }
                if (item.upd.UnlimitedCount) {
                    function filterById(jsonObject, id) { return jsonObject.filter(function (jsonObject) { return (jsonObject['_id'] == id); })[0]; }
                    const json = JSON.stringify(this.modInterKStock);
                    const sjson = JSON.parse(json);
                    var selectedObject = filterById(sjson['ITEM'], item._id);
                    selectedObject.upd.StackObjectsCount = selectedObject.upd.StackObjectsCount * this.modInterKConfig.StockMultiplier;
                    item.upd = selectedObject.upd;
                    // logger.log(item.upd, "blue") 
                    // logger.log(selectedObject.upd, "blue") 
                }
            }
            assort1.items.push(item);
            if (item.parentId == "hideout") { //check if its not part of a preset
                const IKConfig = this.modInterKConfig;
                const indivItem = assort2.barter_scheme[item._id];
                const json = JSON.stringify(this.modInterKStock);
                const sjson = JSON.parse(json);
                function filterById(jsonObject, id) { return jsonObject.filter(function (jsonObject) { return (jsonObject['_id'] == id); })[0]; }
                var selectedObject = filterById(sjson['ITEM'], item._id);
                indivItem[0][0].count = this.modConfigPrices[item._id];
                indivItem[0][0].count = indivItem[0][0].count * IKConfig.PriceMultiplier;
                // logger.log(`"` +  item._id + `"` +":" + indivItem[0][0].count + `,` , "yellow")
                assort1.barter_scheme[item._id] = assort2.barter_scheme[item._id];
                if (this.modInterKConfig.BalancedLoyaltyLevels == true) {
                    assort1.loyal_level_items[item._id] = selectedObject.loyal_level_items;
                }
                else {
                    assort1.loyal_level_items[item._id] = 1;
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
        const logger = tsyringe_1.container.resolve("WinstonLogger");
        i_handbook.push({
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice
        });
    }
    createItem(i_id, i_clone, i_path, i_lname, i_sname, i_desc, i_items, i_global) {
        const JsonUtil = tsyringe_1.container.resolve("JsonUtil");
        const logger = tsyringe_1.container.resolve("WinstonLogger");
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
};
