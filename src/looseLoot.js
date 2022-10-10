"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("../../../../node_modules/tsyringe");
function execute() {
    const databaseServer = tsyringe_1.container.resolve("DatabaseServer");
    const database = databaseServer.getTables();
    const logger = tsyringe_1.container.resolve("WinstonLogger");
    const locations = database.locations;
    const OGCustomLooseLoot = locations.bigmap.looseLoot;
    const OGFactoryDayLooseLoot = locations.factory4_day.looseLoot;
    const CustomLooseLoot = require("../db/looseLoot/Customs/looseLoot.json");
    //logger.log(CustomLoseLoot,"yellow")
    const CustomsForced = CustomLooseLoot.spawnpointsForced;
    for (const loot in CustomsForced) {
        OGCustomLooseLoot.spawnpointsForced.push(CustomsForced[loot]);
        //logger.log( OGCustomLooseLoot.spawnpointsForced,"yellow")
    }
}
// add the code below
module.exports = { execute };
