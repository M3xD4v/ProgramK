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
@injectable()
export class CustomBotGenerator extends BotGenerator
{
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
    )
    {
        super(logger,hashUtil,randomUtil,jsonUtil,profileHelper,databaseServer,botInventoryGenerator,botEquipmentFilterService,botHelper,gameEventHelper,pmcAiService,configServer);
    }

    public generateBot_1(sessionId: string, bot: IBotBase, role: string, node: IBotType, isPmc: boolean, isPlayerScav = false): IBotBase
    {
        const levelResult = this.generateRandomLevel(role, node.experience.level.min, node.experience.level.max);

        let botTier
        const TiersPath = "../db/botgen/BotTiers.json"
        const Tiers = require(TiersPath)
        botTier = this.customBotWeaponGenerator.pickFromRelativeProbability(Tiers)

        bot.Info.Nickname = `${this.randomUtil.getArrayValue(node.firstName)} ${this.randomUtil.getArrayValue(node.lastName) || ""}`;

        if (this.botConfig.showTypeInNickname && !isPlayerScav)
        {
            bot.Info.Nickname += ` ${role}`;
        }

        const skipChristmasItems = !this.gameEventHelper.christmasEventEnabled();
        if (skipChristmasItems)
        {
            this.removeChristmasItemsFromBotInventory(node.inventory);
        }

        bot.Info.Experience = levelResult.exp;
        bot.Info.Level = levelResult.level;
        bot.Info.Settings.Experience = this.randomUtil.getInt(node.experience.reward.min, node.experience.reward.max);
        bot.Info.Settings.StandingForKill = node.experience.standingForKill;
        bot.Info.Voice = this.randomUtil.getArrayValue(node.appearance.voice);
        bot.Health = this.generateHealth(node.health, bot.Info.Side === "Savage");
        bot.Skills = this.generateSkills(node.skills);
        bot.Customization.Head = this.randomUtil.getArrayValue(node.appearance.head);
        bot.Customization.Body = this.randomUtil.getArrayValue(node.appearance.body);
        bot.Customization.Feet = this.randomUtil.getArrayValue(node.appearance.feet);
        bot.Customization.Hands = this.randomUtil.getArrayValue(node.appearance.hands);
        bot.Inventory = this.botInventoryGenerator.generateInventory(sessionId, node.inventory, node.chances, node.generation, role, isPmc);

        if (this.botHelper.isBotPmc(role))
        {
            bot = this.generateDogtag(bot);
        }

        // generate new bot ID
        bot = this.generateId(bot);

        // generate new inventory ID
        bot = this.generateInventoryID(bot);
        this.logger.info(botTier)
        return bot;
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

                bot = this.generateBot_1(sessionId, bot, role.toLowerCase(), baseBotNode, isPmc);

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




