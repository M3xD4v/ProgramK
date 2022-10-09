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
const path = __importStar(require("path"));
function execute() {
    const modPath = path.normalize(path.join(__dirname, '..'));
    const quests = require("../db/quests/MainQuests.json");
    const questsOV = require("../db/quests/QuestOverwrites.json");
    const databaseServer = tsyringe_1.container.resolve("DatabaseServer");
    const database = databaseServer.getTables();
    const questTemplate = database.templates.quests;
    const locales = database.locales.global;
    const logger = tsyringe_1.container.resolve("WinstonLogger");
    const fs = require("fs");
    const localesArray = [
        "ch", "cz", "en", "es-mx", "es", "fr", "ge", "hu", "it", "jp", "pl", "po", "ru", "sk", "tu"
    ];
    for (const lng in localesArray) {
        const localPath = modPath + "/db/locales/" + localesArray[lng] + ".json";
        if (fs.existsSync(localPath)) {
            logger.log("Program K Avaiable languages: " + localesArray[lng], "yellow");
            const local = require(localPath);
            for (const i in local) {
                const SPTLocale = locales[localesArray[lng]];
                const active = SPTLocale[i];
                const aa = local[i];
                if (i == "quest") {
                    for (const x in aa) {
                        const imageRouter = tsyringe_1.container.resolve("ImageRouter");
                        const resFolderPath = modPath + "/res/quests/" + x + ".jpg";
                        imageRouter.addRoute("/files/quest/icon/" + x, resFolderPath);
                        active[x] = aa[x];
                    }
                }
                if (i == "repeatableQuest") {
                    for (const x in aa) {
                        active[x] = aa[x];
                    }
                }
            }
        }
        else {
            const englishLocale = modPath + "/db/locales/" + "en" + ".json";
            const local = require(englishLocale);
            logger.log("ProgramK" + localesArray[lng] + " locale gets overwritten in english", "blue");
            for (const i in local) {
                const SPTLocale = locales[localesArray[lng]];
                const active = SPTLocale[i];
                const aa = local[i];
                if (i == "quest") {
                    for (const x in aa) {
                        active[x] = aa[x];
                    }
                }
                if (i == "repeatableQuest") {
                    for (const x in aa) {
                        active[x] = aa[x];
                    }
                }
            }
        }
    }
    for (const Iquest in quests) {
        questTemplate[Iquest] = quests[Iquest];
    }
    for (const IquestOverwrites in questsOV) {
        questTemplate[IquestOverwrites] = questsOV[IquestOverwrites];
    }
    //logger.log(questTemplate["123"],"red")
}
module.exports = { execute };
