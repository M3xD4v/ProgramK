import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";

function execute() {

    const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
    const database = databaseServer.getTables();
    const logger = container.resolve < ILogger > ("WinstonLogger");
    const locations = database.locations
    const OGCustomLooseLoot = locations.bigmap.looseLoot
    const OGFactoryDayLooseLoot = locations.factory4_day.looseLoot
    const CustomLooseLoot = require("../db/looseLoot/Customs/looseLoot.json");
    //logger.log(CustomLoseLoot,"yellow")
    const CustomsForced = CustomLooseLoot.spawnpointsForced
    for (const loot in CustomsForced) {
      OGCustomLooseLoot.spawnpointsForced.push(CustomsForced[loot])
      //logger.log( OGCustomLooseLoot.spawnpointsForced,"yellow")
    }

  }


  // add the code below
  module.exports = { execute };
