import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import * as path from 'path';

function execute() {
    const modPath = path.normalize(path.join(__dirname, '..'));
    const quests = require("../db/quests/MainQuests.json");
    const questsOV = require("../db/quests/QuestOverwrites.json");
    const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
    const database = databaseServer.getTables();
    const questTemplate = database.templates.quests
    const locales = database.locales.global
    const logger = container.resolve < ILogger > ("WinstonLogger");
    const fs = require("fs");
    const localesArray = [
      "ch", "cz", "en", "en-mx", "es", "fr", "ge", "hu", "it", "jp", "pl", "po", "ru", "sk", "tu"
    ]


    for (const lng in localesArray) {
      const localPath = modPath + "/db/locales/" + localesArray[lng] + ".json"
      if (fs.existsSync(localPath)) {
        logger.log("Program K Avaiable languages: " + localesArray[lng],"blue")

        const local = require(localPath);
        for (const i in local) {
          const SPTLocale = locales[localesArray[lng]]
          const active = SPTLocale[i]
          const aa = local[i]
          if (i == "quest") {
            for (const x in aa) {
              const imageRouter = container.resolve<ImageRouter>("ImageRouter");
              const resFolderPath = modPath + "/res/quests/" +  x + ".jpg";
              imageRouter.addRoute("/files/quest/icon/" + x,resFolderPath);
              active[x] = aa[x]
            }
          }

        }  
}
    }
    for (const Iquest in quests) {
      questTemplate[Iquest] = quests[Iquest]
    }
    for (const IquestOverwrites in questsOV) {
      questTemplate[IquestOverwrites] = questsOV[IquestOverwrites]
    }
    //logger.log(questTemplate["123"],"red")
  }



  module.exports = { execute };
