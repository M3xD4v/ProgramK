"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("../../../../node_modules/tsyringe");
function execute() {
    const databaseServer = tsyringe_1.container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const logger = tsyringe_1.container.resolve("WinstonLogger");
    const database = databaseServer.getTables();
    const items = database.templates.items;
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
}
// add the code below
module.exports = { execute };
