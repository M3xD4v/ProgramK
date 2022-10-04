"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("../../../../node_modules/tsyringe");
function execute() {
    const databaseServer = tsyringe_1.container.resolve("DatabaseServer");
    const database = databaseServer.getTables();
    this.presets = require("../db/presets/presets.json");
    const logger = tsyringe_1.container.resolve("WinstonLogger");
    database.globals.config.Mastering[3].Templates.push("VPO208RIFLE");
    database.globals.config.Mastering[4].Templates.push("TG2");
    database.globals.config.Mastering[32].Templates.push("VPO212");
    database.globals.config.Mastering[32].Templates.push("VEPRPIONEER");
    database.globals.config.Mastering[32].Templates.push("SOC-97R");
    database.globals.config.Mastering[51].Templates.push("MCX556");
    database.globals.config.Mastering[41].Templates.push("vpo192");
    database.globals.config.Mastering[0].Templates.push("STM366");
    database.globals.config.Mastering[0].Templates.push("STM556");
    database.globals.config.Mastering[31].Templates.push("remington338");
    database.globals.config.Mastering[59].Templates.push("weapon_chiappa_rhino_60ds_9x33R");
    database.globals.config.Mastering[59].Templates.push("weapon_chiappa_rhino_200ds_9x33R");
    database.globals.config.Mastering[59].Templates.push("weapon_chiappa_rhino_40ds_9x33R");
    for (const preset in this.presets) {
        const ps = this.presets[preset];
        const id = ps._id;
        database.globals.ItemPresets[preset] = ps;
        const barter = [[
                {
                    "_tpl": "5449016a4bdc2d6f028b456f",
                    "count": 94691
                },
            ]
        ];
        database.traders["ragfair"].assort.barter_scheme[id] = barter;
        database.traders["ragfair"].assort.loyal_level_items[id] = 1;
        let itm = this.presets[preset];
        itm._items[0].upd = ["upd", {
                "StackObjectsCount": 99999999,
                "UnlimitedCount": true
            }];
        itm._items[0].parentId = "hideout";
        itm._items[0].slotId = "hideout";
        for (let i = 0; i < itm._items.length; i++) {
            database.traders["ragfair"].assort.items[id] = itm._items[0];
            logger.log(database.traders["ragfair"].assort.items[id], "blue");
        }
    }
}
// add the code below
module.exports = { execute };
