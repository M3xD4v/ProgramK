import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {JsonUtil} from "@spt-aki/utils/JsonUtil";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { ILocaleGlobalBase } from "@spt-aki/models/spt/server/ILocaleBase";


import * as itemsToAdd from "../IDs/IDs.json";
import * as path from 'path';
import * as fs from 'fs';



class Mod implements IPostDBLoadMod, IPreAkiLoadMod  {

    logger: ILogger
    DB: JSON

    modPath: string = path.normalize(path.join(__dirname, '..'));    
    modConfig: JSON
    modName: string

    traderBase: JSON

    constructor() {
    }

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");

        //Loading Config
        this.modConfig = require("../config/config.json");
        this.modName = this.modConfig.ModName;

        //Loading TraderBase
        let traderBasePath = this.modPath+"/db/base/base.json";
        if(fs.existsSync(traderBasePath)){
            this.traderBase = require(traderBasePath);
        }
        else{
            this.logger.error(this.modName +"required base.json missing in /db/base/");
        }        

        this.logger.debug(`[${this.modName}] Loading... `);

        this.registerProfileImage(container);
        this.setupTraderUpdateTime(container);

    }



    public postDBLoad(container: DependencyContainer): void {
        const databaseModule = require("./databaseModule");

        const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
        const tables = databaseServer.getTables();
        const logger = container.resolve < ILogger > ("WinstonLogger");
        const database = databaseServer.getTables();
        const items = database.templates.items;
        const handbook = database.templates.handbook.Items;
        const global = database.locales.global;
        const traders = database.traders;


        logger.log("Program K Loaded", "yellow");



        for (const itemInJson in itemsToAdd) {
            if (itemsToAdd[itemInJson].id === undefined) {
                break;
            }
            this.createItemHandbookEntry(itemsToAdd[itemInJson].id, itemsToAdd[itemInJson].handbookID, itemsToAdd[itemInJson].handbookPrice, handbook);
            this.createItem(itemsToAdd[itemInJson].id, itemsToAdd[itemInJson].cloneID, itemsToAdd[itemInJson].bundle, itemsToAdd[itemInJson].fullName, itemsToAdd[itemInJson].shortName, itemsToAdd[itemInJson].description, items, global);
        }


        databaseModule.execute()
        database.templates.items["5447a9cd4bdc2dbd208b4567"]._props.Foldable = true
        database.templates.items["5447a9cd4bdc2dbd208b4567"]._props.FoldedSlot = "mod_stock"
        database.templates.items["5447a9cd4bdc2dbd208b4567"]._props.Slots[3]._props.filters[0].Filter.push("5bcf0213d4351e0085327c17");
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
        this.logger.debug(`[${this.modName}] Loaded`);

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
            this.logger.error(this.modName+": No Files in /db/assort/"); 
            return assort;
        }

        files.forEach(file => {
            assort = this.mergeAssorts(assort,file);
        });
        this.logger.info(this.modName+": Loaded "+fileCount+" files.");     
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
            seconds: this.modConfig.TraderUpdateTimeInSec
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
			assort1.items.push(item);
			if(item.parentId =="hideout"){  //check if its not part of a preset
				assort1.barter_scheme[item._id] = assort2.barter_scheme[item._id];
				assort1.loyal_level_items[item._id] = assort2.loyal_level_items[item._id];
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
        //add item to handbook
        const logger = container.resolve < ILogger > ("WinstonLogger");
        //  logger.info("Adding item to handbook: " + i_id);

        i_handbook.push({
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice
        });
        //  logger.success("Item successfully added to handbook: " + i_id);
    }

    createItem(i_id, i_clone, i_path, i_lname, i_sname, i_desc, i_items, i_global) {
        const JsonUtil = container.resolve < JsonUtil > ("JsonUtil");
        const logger = container.resolve < ILogger > ("WinstonLogger");
        const item = JsonUtil.clone(i_items[i_clone]);
        //logger.info("Adding item to database: " + i_id);

        //global changes for all new items
        item._id = i_id;
        item._props.Prefab.path = i_path;


        //special changes for those specified within
        for (const propsToEdit in itemsToAdd[i_id].propOverrides) {
            item._props[propsToEdit] = itemsToAdd[i_id].propOverrides[propsToEdit];
        }


        //add custom item names to all languages/locales
        for (const localeID in i_global) {
            i_global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            };
        }

        //finally add the new item to the database
        i_items[i_id] = item;
        //  logger.success("Item added to database successfully: " + i_id);
    }


    


}




module.exports = {
    mod: new Mod()
}