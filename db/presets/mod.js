"use strict";

let mydb;

class Mod {
    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const modLoader = container.resolve("PreAkiModLoader");
        const databaseImporter = container.resolve("DatabaseImporter");
        const locales = db.locales.global;
        const items = db.templates.items;
        const handbook = db.templates.handbook.Items;
        const quests = db.templates.quests;

        mydb = databaseImporter.loadRecursive(`${modLoader.getModPath("SamSWAT-M1014")}database/`);

        for (const item in mydb.templates.items) {
            items[item] = mydb.templates.items[item];
        }

        for (const item of Object.values(mydb.templates.handbook.Items)) {
            handbook.push(item);
        }

        for (const preset in mydb.globals.ItemPresets) {
            db.globals.ItemPresets[preset] = mydb.globals.ItemPresets[preset];
        }

        for (const item of mydb.traders.assort.assorts.items) {
            db.traders[mydb.traders.assort.traderId].assort.items.push(item);
        }

        for (const bc in mydb.traders.assort.assorts.barter_scheme) {
            db.traders[mydb.traders.assort.traderId].assort.barter_scheme[bc] = mydb.traders.assort.assorts.barter_scheme[bc];
        }

        for (const level in mydb.traders.assort.assorts.loyal_level_items) {
            db.traders[mydb.traders.assort.traderId].assort.loyal_level_items[level] = mydb.traders.assort.assorts.loyal_level_items[level];
        }

        if (quests["59ca264786f77445a80ed044"].conditions.AvailableForFinish[0]._props.counter != null) {
            quests["59ca264786f77445a80ed044"].conditions.AvailableForFinish[0]._props.counter.conditions[0]._props.weapon.push("weapon_benelli_m1014_12g")
            quests["5a03153686f77442d90e2171"].conditions.AvailableForFinish[0]._props.counter.conditions[0]._props.weapon.push("weapon_benelli_m1014_12g")
            quests["5c0bc91486f7746ab41857a2"].conditions.AvailableForFinish[0]._props.counter.conditions[0]._props.weapon.push("weapon_benelli_m1014_12g")
            quests["5c0bc91486f7746ab41857a2"].conditions.AvailableForFinish[1]._props.counter.conditions[0]._props.weapon.push("weapon_benelli_m1014_12g")
        }

        for (const localeID in locales) {
            db.locales.global[localeID].preset["m1014_short_presetID"] = {
                "Name": "Short"
            }
            db.locales.global[localeID].preset["m1014_sshort_presetID"] = {
                "Name": "Super short"
            }

            for (const locale in mydb.locales.en.templates) {
                locales[localeID].templates[locale] = mydb.locales.en.templates[locale];
            }
        }

        db.globals.config.Mastering[8].Templates.push("weapon_benelli_m1014_12g");
    }
}

module.exports = { mod: new Mod() }