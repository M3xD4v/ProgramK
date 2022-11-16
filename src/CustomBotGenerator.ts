import { BotWeaponGenerator } from "@spt-aki/generators/BotWeaponGenerator";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";
import { GenerateWeaponResult } from "@spt-aki/models/spt/bots/GenerateWeaponResult";
import { PmcAiService } from "@spt-aki/services/PmcAiService";
import { inject, injectable, injectAll } from "tsyringe";
import { GameEventHelper } from "@spt-aki/helpers/GameEventHelper";
import { BotHelper } from "@spt-aki/helpers/BotHelper";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { BotInventoryGenerator } from "@spt-aki/generators/BotInventoryGenerator";
import { BotEquipmentFilterService } from "@spt-aki/services/BotEquipmentFilterService";
import { BotGenerator } from "@spt-aki/generators/BotGenerator";
import {Common, Health as PmcHealth, IBotBase, Mastering, Skills} from "@spt-aki/models/eft/common/tables/IBotBase";
import { Health, IBotType, Inventory } from "@spt-aki/models/eft/common/tables/IBotType";
import {container, DependencyContainer} from "tsyringe";
import { IGenerateBotsRequestData } from "@spt-aki/models/eft/bot/IGenerateBotsRequestData";
import { CustomBotWeaponGenerator } from "./CustomBotWeaponGenerator";
import { stringify } from "querystring";
@injectable()
export class CustomBotGenerator extends BotGenerator {
    constructor(
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("BotInventoryGenerator") protected botInventoryGenerator: BotInventoryGenerator,
        @inject("BotEquipmentFilterService") protected botEquipmentFilterService: BotEquipmentFilterService,
        @inject("BotHelper") protected botHelper: BotHelper,
        @inject("GameEventHelper") protected gameEventHelper: GameEventHelper,
        @inject("PmcAiService") protected pmcAiService: PmcAiService,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("CustomBotWeaponGenerator") protected customBotWeaponGenerator: CustomBotWeaponGenerator
    ) {
        super(logger, hashUtil, randomUtil, jsonUtil, profileHelper, databaseServer, botInventoryGenerator, botEquipmentFilterService, botHelper, gameEventHelper, pmcAiService, configServer);
    }


    public pickClass(Array, map) {
        let RelativeProbabilities = [];
        var i = -1

        for (const [key, value] of Object.entries(Array.Classes)) {
            i = i + 1
            let RT = value["Probability"][map]
            RelativeProbabilities[i] = RT + (RelativeProbabilities[i - 1] || 0);
        }
        const maxCumulativeWeight = RelativeProbabilities[RelativeProbabilities.length - 1];
        const randomNumber = maxCumulativeWeight * Math.random();
        const entries = Object.keys(Array.Classes)

        for (let itemIndex = 0; itemIndex < entries.length; itemIndex += 1) {
            if (RelativeProbabilities[itemIndex] >= randomNumber) {
                return entries[itemIndex]
            }
        }
    }

    public pickTier(Array, Class, playerLevel) {
        const Tiers = Array.Classes[Class].Tiers
        const TierEntry = Object.entries(Tiers)
        let i = -1

        function between(x, min, max) {
            return x >= min && x <= max;
        }
        var rangeIndex = 0
        var isInRange = false
        var tierArray = []
        for (const [key, value] of TierEntry) {
            const startpoint = value["starting_lvl"]
            const endpoint = value["end_lvl"]
            if (between(playerLevel, startpoint, endpoint) == true) {
                if (isInRange == false) {
                    isInRange = true
                }
                tierArray = value["Probability"]
                rangeIndex = rangeIndex + 1
            }
        }

        if (isInRange == false) {
            this.logger.error(`Bot with the class "${Class}" does not have level range that fits the player`)
            return
        }
        if (rangeIndex != 1 && isInRange == true) {
            this.logger.error(`Bot with the class "${Class}" has coliding level ranges`)
            return
        }
        var expandedTierArray = []

        if (rangeIndex == 1 && isInRange == true) {
            var y = 0
            for (const index of tierArray) {
                y = y + 1
                const tierName = "Tier" + y
                expandedTierArray.push({
                    tierName: index
                })

            }
            var stringifiedArray = JSON.stringify(expandedTierArray)
            stringifiedArray = stringifiedArray.replaceAll("{", "")
            stringifiedArray = stringifiedArray.replaceAll("}", "")
            stringifiedArray = stringifiedArray.replaceAll("[", "{")
            stringifiedArray = stringifiedArray.replaceAll("]", "}")
            for (let i = 1; i < 7; i++) {
                const tierName = "Tier" + i
                stringifiedArray = stringifiedArray.replace("tierName", tierName)
            }

            const obj = JSON.parse(stringifiedArray)
            return this.pickFromRelativeProbability(obj)

        }

    }
    public pickFromRelativeProbability(Array) {
        let RelativeProbabilities = [];
        var ObjLength = Object.keys(Array)
        var i = -1
        for (const [key, value] of Object.entries(Array)) {
            i = i + 1
            RelativeProbabilities[i] = value + (RelativeProbabilities[i - 1] || 0);
        }
        const maxCumulativeWeight = RelativeProbabilities[RelativeProbabilities.length - 1];
        const randomNumber = maxCumulativeWeight * Math.random();

        for (let itemIndex = 0; itemIndex < ObjLength.length; itemIndex += 1) {
            if (RelativeProbabilities[itemIndex] >= randomNumber) {
                return ObjLength[itemIndex]
            }
        }
    }
    public generateBot_1(sessionId: string, bot: IBotBase, role: string, node: IBotType, isPmc: boolean,Class,Tier): IBotBase {
        const levelResult = this.generateRandomLevel(role, node.experience.level.min, node.experience.level.max);
        let isPlayerScav = false

        var TierNumber = parseInt(Tier.replace("Tier", ""))
        const skipChristmasItems = !this.gameEventHelper.christmasEventEnabled();
        if (skipChristmasItems) {
            this.removeChristmasItemsFromBotInventory(node.inventory);
        }

        bot.Info.Experience = levelResult.exp;
        bot.Info.Level = levelResult.level;
        bot.Info.Settings.Experience = this.randomUtil.getInt(node.experience.reward.min, node.experience.reward.max);
        bot.Info.Settings.StandingForKill = node.experience.standingForKill;
        bot.Info.Voice = this.randomUtil.getArrayValue(node.appearance.voice);
        if (isPmc == true) {
            bot.Health = this.customHealthGenerator(Class, TierNumber);
            bot.Info.Nickname = `${Class} ${Tier}`
        }else {
            bot.Health = this.customHealthGenerator(Class, TierNumber);
            bot.Info.Nickname = `${this.randomUtil.getArrayValue(node.firstName)} ${this.randomUtil.getArrayValue(node.lastName) || ""}`;
        }

        if (this.botConfig.showTypeInNickname && !isPlayerScav) {
            bot.Info.Nickname += ` ${role}`;
        }

        bot.Skills = this.generateSkills(node.skills);
        bot.Customization.Head = this.randomUtil.getArrayValue(node.appearance.head);
        bot.Customization.Body = this.randomUtil.getArrayValue(node.appearance.body);
        bot.Customization.Feet = this.randomUtil.getArrayValue(node.appearance.feet);
        bot.Customization.Hands = this.randomUtil.getArrayValue(node.appearance.hands);
        bot.Inventory = this.botInventoryGenerator.generateInventory_custom(sessionId, node.inventory, node.chances, node.generation, role, isPmc, Class, Tier);

        if (this.botHelper.isBotPmc(role)) {
            bot = this.generateDogtag(bot);
        }

        // generate new bot ID
        bot = this.generateId(bot);

        // generate new inventory ID
        bot = this.generateInventoryID(bot);
        return bot;
    }


    public customHealthGenerator(Class, Tier) {
        const Classes = require("../db/botgen/Class.json")
        const classHealth = Classes.Classes[Class].health
        const health = require("../db/botgen/Classes/" + classHealth + "/health.json")
        const bodyparts = health.health.BodyParts[0]
        const Index = Tier - 1

        function gMaxMin(value) {
            if (Array.isArray(value) == true) {
                var Max = value[Index]
            } else {
                var Max = value
            }
            return Max
        }
        const newHealthUsingFunction = {
            Hydration: {
                Current: this.randomUtil.getInt(gMaxMin(health.health.Hydration.min), gMaxMin(health.health.Hydration.max)),
                Maximum: gMaxMin(health.health.Hydration.max)
            },
            Energy: {
                Current: this.randomUtil.getInt(gMaxMin(health.health.Energy.min), gMaxMin(health.health.Energy.max)),
                Maximum: gMaxMin(health.health.Energy.max)
            },
            Temperature: {
                Current: 37,
                Maximum: 37
            },
            BodyParts: {
                Head: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.Head.min), gMaxMin(bodyparts.Head.max)),
                        Maximum: gMaxMin(bodyparts.Head.max),
                    }
                },
                Chest: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.Chest.min), gMaxMin(bodyparts.Chest.max)),
                        Maximum: gMaxMin(bodyparts.Chest.max),
                    }
                },
                Stomach: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.Stomach.min), gMaxMin(bodyparts.Stomach.max)),
                        Maximum: gMaxMin(bodyparts.Stomach.max),
                    }
                },
                LeftArm: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.LeftArm.min), gMaxMin(bodyparts.LeftArm.max)),
                        Maximum: gMaxMin(bodyparts.LeftArm.max),
                    }
                },
                RightArm: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.RightArm.min), gMaxMin(bodyparts.RightArm.max)),
                        Maximum: gMaxMin(bodyparts.RightArm.max),
                    }
                },
                LeftLeg: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.LeftLeg.min), gMaxMin(bodyparts.LeftLeg.max)),
                        Maximum: gMaxMin(bodyparts.LeftLeg.max),
                    }
                },
                RightLeg: {
                    Health: {
                        Current: this.randomUtil.getInt(gMaxMin(bodyparts.RightLeg.min), gMaxMin(bodyparts.RightLeg.max)),
                        Maximum: gMaxMin(bodyparts.RightLeg.max),
                    }
                }
            },
            UpdateTime: 0
        }
        return newHealthUsingFunction

    }
    
        
    public override generate(sessionId: string, info: IGenerateBotsRequestData): IBotBase[]
    {
        const output: IBotBase[] = [];
        const playerLevel = this.profileHelper.getPmcProfile(sessionId).Info.Level;
        for (const condition of info.conditions)
        {
            for (let i = 0; i < condition.Limit; i++)
            {
                const pmcSide = this.getRandomisedPmcSide();
                const profile = this.profileHelper.getFullProfile(sessionId);
                const pmcProfile = this.profileHelper.getPmcProfile(sessionId);
                const playerLevel = pmcProfile.Info.Level;
                const map = profile.inraid.location
                const Classes = require("../db/botgen/Class.json")
                var Class = this.pickClass(Classes, map)
                var Tier = this.pickTier(Classes, Class, playerLevel)
                let role = condition.Role;
                // Bot can be a pmc if its NOT a player scav
                const isPmc = this.botHelper.shouldBotBePmc(role);

                let bot = this.getCloneOfBotBase();
                // If bot will be Pmc, get Pmc specific difficulty settings
                bot.Info.Settings.BotDifficulty = (isPmc)
                    ? this.getPMCDifficulty(condition.Difficulty)
                    : condition.Difficulty;

                if (isPmc)
                {
                    // Set bot role to usec/bear so we can generate bot gear with corrisponding json
                    role = pmcSide;
                }

                bot.Info.Settings.Role = role;
                bot.Info.Side = (isPmc) ? pmcSide : "Savage";

                const baseBotNode = this.botHelper.getBotTemplate(role);

                this.botEquipmentFilterService.filterBotEquipment(baseBotNode, playerLevel, isPmc, role);
                bot = this.generateBot_1(sessionId, bot, role.toLowerCase(), baseBotNode, isPmc,Class,Tier);


                if (isPmc)
                {
                    // Restore botRole back to its intended type now we've generated its equipment/loot
                    bot.Info.Settings.Role = this.pmcAiService.getPmcRole(pmcSide);
                }

                bot.sptIsPmc = isPmc;
                output.unshift(bot);
            }
        }
        
        this.logPmcGeneratedCount(output)

        return output;
    }

}




