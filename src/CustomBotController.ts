import { inject, injectable } from "tsyringe";
import { BotController } from "@spt-aki/controllers/BotController";
import { ApplicationContext } from "@spt-aki/context/ApplicationContext";
import { ContextVariableType } from "@spt-aki/context/ContextVariableType";
import { BotGenerator } from "@spt-aki/generators/BotGenerator";
import { BotHelper } from "@spt-aki/helpers/BotHelper";
import { Difficulty } from "@spt-aki/models/eft/common/tables/IBotType";
import { IStartOfflineRaidRequestData } from "@spt-aki/models/eft/match/IStartOffineRaidRequestData";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { BotGenerationCacheService } from "@spt-aki/services/BotGenerationCacheService";
import { PmcAiService } from "@spt-aki/services/PmcAiService";
@injectable()
export class CustomBotController extends BotController
{
    constructor(
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("BotGenerator") protected botGenerator: BotGenerator,
        @inject("BotHelper") protected botHelper: BotHelper,
        @inject("PmcAiService") protected pmcAiService: PmcAiService,
        @inject("BotGenerationCacheService") protected botGenerationCacheService: BotGenerationCacheService,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("ApplicationContext") protected applicationContext: ApplicationContext
    )
    {
        super(logger,databaseServer,botGenerator,botHelper,pmcAiService,botGenerationCacheService,configServer,applicationContext);
    }

    public override getBotDifficulty(type: string, difficulty: string): Difficulty
    {
        const matchInfo = this.applicationContext.getLatestValue(ContextVariableType.MATCH_INFO).getValue<IStartOfflineRaidRequestData>();

        // Check value chosen in pre-raid difficulty dropdown
        // If value is not 'asonline', change requested difficulty to be what was chosen in dropdown
        const botDifficultyDropDownValue = matchInfo.gameSettings.wavesSettings.botDifficulty.toLowerCase()
        if (botDifficultyDropDownValue !== "asonline")
        {
            difficulty = this.botHelper.convertBotDifficultyDropdownToBotDifficulty(botDifficultyDropDownValue);
        }

        let difficultySettings: Difficulty;
        const usecType = this.pmcAiService.getPmcRole("usec");
        const bearType = this.pmcAiService.getPmcRole("bear");
        const lowercasedType = type.toLowerCase();
        switch (type.toLowerCase())
        {
            case bearType.toLowerCase():
                difficultySettings = this.getPmcDifficultySettings_custom("bear", difficulty, usecType, bearType);
                this.logger.log(difficultySettings,"cyan");
                break;
            case usecType.toLowerCase():
                difficultySettings = this.getPmcDifficultySettings_custom("usec", difficulty, usecType, bearType);
                this.logger.log(difficultySettings,"cyan");
                break;
            default:
                difficultySettings = this.botHelper.getBotDifficultySettings(type, difficulty);
                this.botHelper.addBotToEnemyList(difficultySettings, [bearType, usecType], lowercasedType);
                break;
        }

        return difficultySettings;
    }

    public getPmcDifficultySettings_custom(pmcType: "bear"|"usec", difficulty: string, usecType: string, bearType: string): Difficulty
    {
        const difficultySettings = this.botHelper.getPmcDifficultySettings(pmcType, difficulty);

        const friendlyType = pmcType === "bear"
            ? bearType
            : usecType;
        const enemyType = pmcType === "bear"
            ? usecType
            : bearType;

        this.botHelper.addBotToEnemyList(difficultySettings, this.botConfig.pmc.enemyTypes, friendlyType); // Add generic bot types to enemy list
        this.botHelper.addBotToEnemyList(difficultySettings, [enemyType, friendlyType], ""); // add same/opposite side to enemy list
        this.botHelper.randomisePmcHostility(difficultySettings);

        return difficultySettings;
    }

}





