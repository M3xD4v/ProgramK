import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import * as path from 'path';
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
function execute() {
    const modPath = path.normalize(path.join(__dirname, '..'));
    const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
    const database = databaseServer.getTables();
    const questTemplate = database.templates.quests
    const locales = database.locales.global
    const logger = container.resolve < ILogger > ("WinstonLogger");
    const fs = require("fs");
    const modCConfig = require("../config/config.json");
    const modPath1 = path.normalize(path.join(__dirname, '..'));
    const questassort = require(modPath1+"/db/questassort/questassort.json")
    if (modCConfig.QuestItems == true) {
      logger.log("ProgramK: Quest items --- ENABLED", "magenta")
    } else {
      logger.log("ProgramK: Quest items --- DISABLED", "magenta")
      questassort.success = {}
    }
    const localesArray = [
      "ch", "cz", "en", "es-mx", "es", "fr", "ge", "hu", "it", "jp", "pl", "po", "ru", "sk", "tu"
    ]


    for (const lng in localesArray) {
      const localPath = modPath + "/db/locales/" + localesArray[lng] + ".json"
      if (fs.existsSync(localPath)) {
        logger.log("ProgramK: Loaded language --- " + localesArray[lng],"magenta")

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
          if (i == "repeatableQuest") {
            for (const x in aa) {
              active[x] = aa[x]
            }
          }
        }
}
else {
  const englishLocale = modPath + "/db/locales/" + "en" + ".json"
  const local = require(englishLocale);
  for (const i in local) {
    const SPTLocale = locales[localesArray[lng]]
    const active = SPTLocale[i]
    const aa = local[i]
    if (i == "quest") {
      for (const x in aa) {
        active[x] = aa[x]
      }
    }
    if (i == "repeatableQuest") {
      for (const x in aa) {
        active[x] = aa[x]
      }
    }
  }
}
    }
const questList = [
  require("../db/quests/MainQuests.json"), require("../db/quests/vpoGornostay.json"), require("../db/quests/QuestOverwrites.json")
]
    for (const Iquest in questList) {
      const quest = questList[Iquest]
      for (const Iquest1 in quest) {
        questTemplate[Iquest1] = quest[Iquest1]
        //logger.log(quest[Iquest1],"red")
      }
    }
    const dailyquests = {
      "traderId": "newTraderId",
      "questTypes": [
          "Completion",
          "Exploration",
          "Elimination"
      ]}
      const cServer = container.resolve<ConfigServer>("ConfigServer");
      const questConfig = cServer.getConfig<ITraderConfig>(ConfigTypes.QUEST);
      questConfig.repeatableQuests[0].traderWhitelist.push(dailyquests)
    //logger.log(questTemplate["123"],"red")

  }
module.exports = { execute };
