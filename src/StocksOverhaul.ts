import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";

function execute() {

    const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
    const logger = container.resolve < ILogger > ("WinstonLogger");
    const database = databaseServer.getTables();
    const modConfig = require("../config/config.json")
    const stockSlot1 = [
        {
        "_name": "mod_stock_000",
        "_id": "5c793fb92e2216544f31bfb66",
        "_parent": "5c793fb92e221644f31bfb64",
        "_props": {
        "filters": [
        {
        "Shift": 0,
        "Filter": [
        "5fc2369685fd526b824a5713",
        "606587d11246154cad35d635",
        "602e620f9b513876d4338d9a",
        "5a9eb32da2750c00171b3f9c",
        "5bfe86df0db834001b734685",
        "55d4ae6c4bdc2d8b2f8b456e",
        "5c87a07c2e2216001219d4a2",
        "5bb20e70d4351e0035629f8f",
        "5beec8c20db834001d2c465c",
        "5fbbaa86f9986c4cff3fe5f6",
        "5fce16961f152d4312622bc9",
        "5ae30c9a5acfc408fb139a03",
        "5d135e83d7ad1a21b83f42d8",
        "5d135ecbd7ad1a21c176542e",
        "56eabf3bd2720b75698b4569",
        "58d2946386f774496974c37e",
        "58d2946c86f7744e271174b5",
        "58d2947686f774485c6a1ee5",
        "58d2947e86f77447aa070d53",
        "5d44069ca4b9361ebd26fc37",
        "5d4406a8a4b9361e4f6eb8b7",
        "5947c73886f7747701588af5",
        "5c793fde2e221601da358614",
        "5b39f8db5acfc40016387a1b",
        "628a85ee6b1d481ff772e9d5"
        ]
        }
        ]
        },
        "_required": false,
        "_mergeSlotWithChildren": true,
        "_proto": "55d30c4c4bdc2db4468b457e"
        }
    ]
    const stockSlot2 = [
        {
            "_name": "mod_stock_004",
            "_id": "5c793fb92e2216344f31bfb66",
            "_parent": "5c793fb92e221644f31bfb64",
            "_props": {
            "filters": [
            {
            "Shift": 0,
            "Filter": [
            "5fc2369685fd526b824a5713",
            "606587d11246154cad35d635",
            "602e620f9b513876d4338d9a",
            "5a9eb32da2750c00171b3f9c",
            "5bfe86df0db834001b734685",
            "55d4ae6c4bdc2d8b2f8b456e",
            "5c87a07c2e2216001219d4a2",
            "5bb20e70d4351e0035629f8f",
            "5beec8c20db834001d2c465c",
            "5fbbaa86f9986c4cff3fe5f6",
            "5fce16961f152d4312622bc9",
            "5ae30c9a5acfc408fb139a03",
            "5d135e83d7ad1a21b83f42d8",
            "5d135ecbd7ad1a21c176542e",
            "56eabf3bd2720b75698b4569",
            "58d2946386f774496974c37e",
            "58d2946c86f7744e271174b5",
            "58d2947686f774485c6a1ee5",
            "58d2947e86f77447aa070d53",
            "5d44069ca4b9361ebd26fc37",
            "5d4406a8a4b9361e4f6eb8b7",
            "5947c73886f7747701588af5",
            "5c793fde2e221601da358614",
            "5b39f8db5acfc40016387a1b",
            "628a85ee6b1d481ff772e9d5"
            ]
            }
            ]
            },
            "_required": false,
            "_mergeSlotWithChildren": false,
            "_proto": "55d30c4c4bdc2db4468b457e"
            }
    ]
    const stockSlot3 = [
        {
            "_name": "mod_stock_002",
            "_id": "5c793fb92e2221644f31bfb66",
            "_parent": "5c793fb92e221644f31bfb64",
            "_props": {
            "filters": [
            {
            "Shift": 0,
            "Filter": [
            "5fc2369685fd526b824a5713",
            "606587d11246154cad35d635",
            "602e620f9b513876d4338d9a",
            "5a9eb32da2750c00171b3f9c",
            "5bfe86df0db834001b734685",
            "55d4ae6c4bdc2d8b2f8b456e",
            "5c87a07c2e2216001219d4a2",
            "5bb20e70d4351e0035629f8f",
            "5beec8c20db834001d2c465c",
            "5fbbaa86f9986c4cff3fe5f6",
            "5fce16961f152d4312622bc9",
            "5ae30c9a5acfc408fb139a03",
            "5d135e83d7ad1a21b83f42d8",
            "5d135ecbd7ad1a21c176542e",
            "56eabf3bd2720b75698b4569",
            "58d2946386f774496974c37e",
            "58d2946c86f7744e271174b5",
            "58d2947686f774485c6a1ee5",
            "58d2947e86f77447aa070d53",
            "5d44069ca4b9361ebd26fc37",
            "5d4406a8a4b9361e4f6eb8b7",
            "5947c73886f7747701588af5",
            "5c793fde2e221601da358614",
            "5b39f8db5acfc40016387a1b",
            "628a85ee6b1d481ff772e9d5"
            ]
            }
            ]
            },
            "_required": false,
            "_mergeSlotWithChildren": false,
            "_proto": "55d30c4c4bdc2db4468b457e"
            }
    ]
    const stockSlot4 = [
        {
            "_name": "mod_stock_001",
            "_id": "5c793fb9212216244f31bfb66",
            "_parent": "5c793fb92e221644f31bfb64",
            "_props": {
            "filters": [
            {
            "Shift": 0,
            "Filter": [
            "5fc2369685fd526b824a5713",
            "606587d11246154cad35d635",
            "602e620f9b513876d4338d9a",
            "5a9eb32da2750c00171b3f9c",
            "5bfe86df0db834001b734685",
            "55d4ae6c4bdc2d8b2f8b456e",
            "5c87a07c2e2216001219d4a2",
            "5bb20e70d4351e0035629f8f",
            "5beec8c20db834001d2c465c",
            "5fbbaa86f9986c4cff3fe5f6",
            "5fce16961f152d4312622bc9",
            "5ae30c9a5acfc408fb139a03",
            "5d135e83d7ad1a21b83f42d8",
            "5d135ecbd7ad1a21c176542e",
            "56eabf3bd2720b75698b4569",
            "58d2946386f774496974c37e",
            "58d2946c86f7744e271174b5",
            "58d2947686f774485c6a1ee5",
            "58d2947e86f77447aa070d53",
            "5d44069ca4b9361ebd26fc37",
            "5d4406a8a4b9361e4f6eb8b7",
            "5947c73886f7747701588af5",
            "5c793fde2e221601da358614",
            "5b39f8db5acfc40016387a1b",
            "628a85ee6b1d481ff772e9d5"
            ]
            }
            ]
            },
            "_required": false,
            "_mergeSlotWithChildren": false,
            "_proto": "55d30c4c4bdc2db4468b457e"
            }
    ]
    let StockSlotFinal
    const stockConfig = modConfig.EnabledStockSlots
    StockSlotFinal = stockSlot1
    let EnabledSlots = ""
    if (stockConfig.Slot2 == false && stockConfig.Slot3 == false && stockConfig.Slot4 == false){
        EnabledSlots = "| None"
    }
    if (stockConfig.Slot2 == true){
        StockSlotFinal = StockSlotFinal.concat(stockSlot2)
        EnabledSlots = EnabledSlots + "| Second "
    }
    if (stockConfig.Slot3 == true){
        StockSlotFinal = StockSlotFinal.concat(stockSlot3)
        EnabledSlots = EnabledSlots + "| Third "
    }
    if (stockConfig.Slot4 == true){
        StockSlotFinal = StockSlotFinal.concat(stockSlot4)
        EnabledSlots = EnabledSlots + "| Fourth "
    }
    logger.log("ProgramK: Extra stock slots enabled: " + EnabledSlots +" |", "magenta")


    const stocks = [
           "5fc2369685fd526b824a5713",
            "606587d11246154cad35d635",
            "602e620f9b513876d4338d9a",
            "5a9eb32da2750c00171b3f9c",
            "5bfe86df0db834001b734685",
            "55d4ae6c4bdc2d8b2f8b456e",
            "5c87a07c2e2216001219d4a2",
            "5bb20e70d4351e0035629f8f",
            "5beec8c20db834001d2c465c",
            "5fbbaa86f9986c4cff3fe5f6",
            "5fce16961f152d4312622bc9",
            "5ae30c9a5acfc408fb139a03",
            "5d135e83d7ad1a21b83f42d8",
            "5d135ecbd7ad1a21c176542e",
            "56eabf3bd2720b75698b4569",
            "58d2946386f774496974c37e",
            "58d2946c86f7744e271174b5",
            "58d2947686f774485c6a1ee5",
            "58d2947e86f77447aa070d53",
            "5d44069ca4b9361ebd26fc37",
            "5d4406a8a4b9361e4f6eb8b7",
            "5947c73886f7747701588af5",
            "5c793fde2e221601da358614",
            "5b39f8db5acfc40016387a1b",
            "628a85ee6b1d481ff772e9d5"
                 ]
                 const buffertubes = ["5649be884bdc2d79388b4577","5c793fb92e221644f31bfb64","5c0faeddd174af02a962601f","5c793fb92e221644f31bfb64","5c793fc42e221600114ca25d"]
                 for (const bf of buffertubes) {
                     database.templates.items[bf]._props.Slots = StockSlotFinal
                 }
                 for (const stk of stocks) {
                     database.templates.items[stk]._props.ConflictingItems = stocks
                 }
  }


  // add the code below
  module.exports = { execute };
