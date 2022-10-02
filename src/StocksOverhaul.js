"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("../../../../node_modules/tsyringe");
function execute() {
    const databaseServer = tsyringe_1.container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const logger = tsyringe_1.container.resolve("WinstonLogger");
    const database = databaseServer.getTables();
    const items = database.templates.items;
    const stockSlot = [
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
        },
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
        },
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
        },
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
    ];
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
    ];
    const buffertubes = ["5649be884bdc2d79388b4577", "606587e18900dc2d9a55b65f", "5c793fb92e221644f31bfb64", "5bb20e58d4351e00320205d7", "617153016c780c1e710c9a2f", "5c0faeddd174af02a962601f", "5bfe89510db834001808a127", "5afd7e095acfc40017541f61", "5c793fb92e221644f31bfb64", "5c793fc42e221600114ca25d"];
    for (const bf of buffertubes) {
        database.templates.items[bf]._props.Slots = stockSlot;
    }
    for (const stk of stocks) {
        database.templates.items[stk]._props.ConflictingItems = stocks;
    }
    const isModFilterExist = (slots) => slots.findIndex((slot) => slot._name === "mod_stock");
    const isModFilterExist2 = (slots) => slots.findIndex((slot) => slot._name === "mod_stock_001");
    const isItemSlotsExist = (item) => item._props.Slots && item._props.Slots.length > 0;
    const filtersIncludeAttachment = (filterArray) => filterArray.includes("5c793fb92e221644f31bfb64");
    for (const item of Object.values(tables.templates.items)) {
        if (isItemSlotsExist(item)) {
            const index = isModFilterExist(item._props.Slots);
            const index2 = isModFilterExist2(item._props.Slots);
            if (index > -1 && filtersIncludeAttachment(item._props.Slots[index]._props.filters[0].Filter)) {
                item._props.Slots[index]._props.filters[0].Filter.push("Slot2Strike");
                item._props.Slots[index]._props.filters[0].Filter.push("Slot3Strike");
                item._props.Slots[index]._props.filters[0].Filter.push("Slot4Strike");
                item._props.Slots[index]._props.filters[0].Filter.push("StrikePrototype");
            }
            if (index2 > -1 && filtersIncludeAttachment(item._props.Slots[index2]._props.filters[0].Filter)) {
                item._props.Slots[index2]._props.filters[0].Filter.push("Slot2Strike");
                item._props.Slots[index2]._props.filters[0].Filter.push("Slot3Strike");
                item._props.Slots[index2]._props.filters[0].Filter.push("Slot4Strike");
                item._props.Slots[index2]._props.filters[0].Filter.push("StrikePrototype");
            }
        }
    }
}
// add the code below
module.exports = { execute };
