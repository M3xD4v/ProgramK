import {container, DependencyContainer} from "tsyringe";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

function execute() {
    const logger = container.resolve < ILogger > ("WinstonLogger");
    function l(string1,string2){
        if (string1 != undefined && string2 != undefined) {
            logger.log(string1,"cyan")
        }
        if (string1 != undefined && string2 == undefined) {
            logger.log(string1,"white")
        }
        if (string2 != undefined) {
            logger.log(string2,"blue")
        }
    }

    const databaseServer = container.resolve < DatabaseServer > ("DatabaseServer");
    const tables = databaseServer.getTables();

    const weapontypeFile = require("../db/botgen/WeaponTypes.json")
    const WPFile = require("../db/botgen/weaponTypes/assault_rifles.json")

    var total = 0
    var RP = weapontypeFile
    var map = "bigmap"



    function pickClass(Array,map) {
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
    function pickFromRelativeProbability(Array) {
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
    

      function pickTier(Array,Class,playerLevel) {
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
           if (between(playerLevel,startpoint,endpoint) == true ) {
            if (isInRange == false ) {
                isInRange = true
            }
            tierArray = value["Probability"]
            rangeIndex = rangeIndex + 1
           }
           }

           if (isInRange == false) {
            logger.error(`Bot with the class "${Class}" does not have level range that fits the player`)
            return 
           }
           if (rangeIndex != 1 && isInRange == true) {
            logger.error(`Bot with the class "${Class}" has coliding level ranges`) 
            return
           }
           var expandedTierArray = []

           if (rangeIndex == 1 && isInRange == true) {
            var y = 0 
            for (const index of tierArray) 
            { 
                y = y + 1
                const tierName = "Tier" + y
                expandedTierArray.push({
                    tierName : index
                })

            }
            var stringifiedArray = JSON.stringify(expandedTierArray)
            stringifiedArray = stringifiedArray.replaceAll("{","")
            stringifiedArray = stringifiedArray.replaceAll("}","")
            stringifiedArray = stringifiedArray.replaceAll("[","{")
            stringifiedArray = stringifiedArray.replaceAll("]","}")
            for (let i = 1; i < 7; i++) {
                const tierName = "Tier" + i
                stringifiedArray = stringifiedArray.replace("tierName",tierName)
              }

            const obj = JSON.parse(stringifiedArray)
            return pickFromRelativeProbability(obj)

           }

      }

      const Classes = require("../db/botgen/Class.json")
      var map = "bigmap"
      var level = 1
      
      for (let i = 0; i < 15; i++) {
             var ChoosenClass = pickClass(Classes,map)
             const tier = pickTier(Classes,ChoosenClass,level)
             logger.log(`Map: ${map} Level: ${level} Class:${ChoosenClass} Tier: ${tier}`,"magenta")
      }

    }
    


    
    /*
    for (const [key, value] of Object.entries(RP)) {
        total = total + parseInt(value)
    }

    for (const [key, value] of Object.entries(RP)) {
        var individualPrecentage = (parseInt(value)/total)*100
        if (RP != weapontypeFile){
            for (const item of Object.values(tables.templates.items)) {
            if (item._id ==key) {
                var name = item._name
            }
        }
        l(`${name} (${key}):`, `${individualPrecentage.toFixed(2)}%`)
    } else {
        l(`${key}:`, `${individualPrecentage.toFixed(2)}%`)
    }
    }
    */
  }
  module.exports = { execute };
