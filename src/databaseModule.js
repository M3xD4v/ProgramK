"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("../../../../node_modules/tsyringe");
function execute() {
    const databaseServer = tsyringe_1.container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const logger = tsyringe_1.container.resolve("WinstonLogger");
    const database = databaseServer.getTables();
    const items = database.templates.items;
    const _366mags = [
        "61695095d92c473c7702147a",
        "5c5970672e221602b21d7855",
        "587df583245977373c4f1129",
        "587df3a12459772c28142567",
        "59e5d83b86f7745aed03d262",
        "5a01c29586f77474660c694c",
        "5ac66bea5acfc43b321d4aec",
        "59d625f086f774661516605d",
        "5b1fd4e35acfc40018633c39",
        "5a0060fc86f7745793204432",
        "59e5f5a486f7746c530b3ce2",
        "5b1fb3e15acfc4001637f068",
        "59d6272486f77466146386ff",
        "5e21a3c67e40bd02257a008a",
        "5cbdc23eae9215001136a407",
        "5c6175362e221600133e3b94",
        "59fafc5086f7740dbe19f6c3",
        "59fafc9386f774067d462453",
        "5cfe8010d7ad1a59283b14c6",
        "5de653abf76fdc1ce94a5a2a",
        "5c503ac82e221602b21d6e9a",
        "5c503ad32e2216398b5aada2",
        "STM366Mag"
    ];
    const _366weapons = [
        "5de652c31b7e3716273428be",
        "59e6687d86f77411d949b251",
        "VPO208RIFLE",
        "TG2",
        "VPO212",
        "STM366"
    ];
    const _366 = [
        "59e655cb86f77411dc52a77b",
        "59e6542b86f77411dc52a77a",
        "59e6658b86f77411d949b250",
        "5f0596629e22f464da6bbdd9"
    ];
    const _762x39 = [
        "59e0d99486f7744a32234762",
        "59e4d3d286f774176a36250a",
        "5656d7c34bdc2d9d198b4587",
        "59e4cf5286f7741778269d8a",
        "59e4d24686f7741776641ac7",
        "601aa3d2b2bcb34913271e6d"
    ];
    const _556x45 = [
        "59e6920f86f77411d82aa167",
        "59e6927d86f77411da468256",
        "54527a984bdc2d4e668b4567",
        "54527ac44bdc2d36668b4567",
        "59e68f6f86f7746c9f75e846",
        "59e6906286f7746c9f75e847",
        "59e690b686f7746c9f75e848",
        "59e6918f86f7746c9f75e849",
        "60194943740c5d77f6705eea",
        "601949593ae8f707c4608daa",
        "5c0d5ae286f7741e46554302"
    ];
    //muzzle Brake
    database.templates.items["5de65547883dde217541644b"]._props.Slots[0]._props.filters[0].Filter.push("366MUZZLEBRAKE"); //vpo-215 barrel
    database.templates.items["59e6687d86f77411d949b251"]._props.Slots[2]._props.filters[0].Filter.push("366MUZZLEBRAKE"); //209
    database.templates.items["TG2"]._props.Slots[2]._props.filters[0].Filter.push("366MUZZLEBRAKE");
    database.templates.items["5de652c31b7e3716273428be"]._props.Slots[2]._props.filters[0].Filter.push("barrel_vpo215_420mm");
    database.templates.items["5de652c31b7e3716273428be"]._props.Slots[2]._props.filters[0].Filter.push("barrel_vpo215_520mm");
    database.templates.items["6259b864ebedf17603599e88"]._props.Slots[0]._props.filters[0].Filter.push("barrel_m3_benelli_660mm_12g");
    database.templates.items["6259b864ebedf17603599e88"]._props.Slots[3]._props.filters[0].Filter.push("6259c3d8012d6678ec38eeb8");
    database.templates.items["MCX556UPPER"]._props.Slots[1]._props.filters[0].Filter.push("barrel_MCX556_400mm");
    database.templates.items["MCX556UPPER"]._props.Slots[1]._props.filters[0].Filter.push("barrel_MCX556_330mm");
    database.templates.items["5fbcc3e4d6fa9c00c571bb58"]._props.Slots[1]._props.filters[0].Filter.push("barrel_MCX_400mm");
    database.templates.items["5fbcc3e4d6fa9c00c571bb58"]._props.Slots[1]._props.filters[0].Filter.push("barrel_MCX_330mm");
    database.templates.items["barrel_vpo215_520mm"]._props.Slots[0]._props.filters[0].Filter.push("366MUZZLEBRAKE");
    database.templates.items["barrel_vpo215_420mm"]._props.Slots[0]._props.filters[0].Filter.push("366MUZZLEBRAKE");
    database.templates.items["5de65547883dde217541644b"]._props.Slots[0]._props.filters[0].Filter.push("366MUZZLEBRAKE");
    database.templates.items["5ea03f7400685063ec28bfa8"]._props.Slots[3]._props.filters[0].Filter.push("barrel_ppsh_456mm_762x25");
    database.templates.items["5ea03f7400685063ec28bfa8"]._props.Slots[2]._props.filters[0].Filter.push("extended_reciever_ppsh_zis_ppsh41_std");
    //tweaks
    const scopesconflict = [
        "5b2388675acfc4771e1be0be",
        "5a37cb10c4a282329a73b4e7",
        "57c5ac0824597754771e88a9",
        "618ba27d9008e4636a67f61d",
        "56ea70acd2720b844b8b4594",
        "5aa66be6e5b5b0214e506e97",
        "5dff772da3651922b360bf91",
        "5b3b99475acfc432ff4dcbee"
    ];
    const offsetmount = [
        "NCSTARLONG_RIGHT",
        "NCSTARLONG_LEFT",
        "Leftmount_all_ncstar_mpr45",
        "5649a2464bdc2d91118b45a8"
    ];
    const pistols = [
        "weapon_chiappa_rhino_60ds_9x33R",
        "weapon_chiappa_rhino_40ds_9x33R",
        "weapon_chiappa_rhino_200ds_9x33R",
    ];
    for (const conflict of scopesconflict) {
        database.templates.items[conflict]._props.ConflictingItems.length = 0;
        logger.log("removed " + conflict, "blue");
    }
    database.templates.items["5b3b99475acfc432ff4dcbee"]._props.ConflictingItems.length = 0;
    //vpo209
    database.templates.items["59e6687d86f77411d949b251"]._props.RecoilForceBack = 450;
    database.templates.items["59e6687d86f77411d949b251"]._props.RecoilForceUp = 250;
    database.templates.items["5f0596629e22f464da6bbdd9"]._props.ammoRec = 17;
    for (const cal of _366) {
        database.templates.items["5c503ac82e221602b21d6e9a"]._props.Cartridges[0]._props.filters[0].Filter.push(cal);
        database.templates.items["5c503ad32e2216398b5aada2"]._props.Cartridges[0]._props.filters[0].Filter.push(cal);
    }
    for (const pistolID of pistols) {
        items["55d7217a4bdc2d86028b456d"]._props.Slots[2]._props.filters[0].Filter.push(pistolID);
        database.templates.items[pistolID]._props.DoubleActionAccuracyPenalty = 0.2;
    }
    for (const cal of _762x39) {
        database.templates.items["5c503ac82e221602b21d6e9a"]._props.Cartridges[0]._props.filters[0].Filter.push(cal);
        database.templates.items["5c503ad32e2216398b5aada2"]._props.Cartridges[0]._props.filters[0].Filter.push(cal);
    }
    for (const cal of _556x45) {
        database.templates.items["5c503ac82e221602b21d6e9a"]._props.Cartridges[0]._props.filters[0].Filter.push(cal);
        database.templates.items["5c503ad32e2216398b5aada2"]._props.Cartridges[0]._props.filters[0].Filter.push(cal);
    }
    for (const ofm of offsetmount) {
        database.templates.items["5f2aa49f9b44de6b1b4e68d4"]._props.Slots[0]._props.filters[0].Filter.push(ofm);
        database.templates.items["5c48a14f2e2216152006edd7"]._props.Slots[3]._props.filters[0].Filter.push(ofm);
        database.templates.items["5dcbd6b46ec07c0c4347a564"]._props.Slots[3]._props.filters[0].Filter.push(ofm);
    }
    for (const mags of _366mags) {
        database.templates.items[mags]._props.Cartridges[0]._props.filters[0].Filter.push("366FLECHETTE");
        database.templates.items[mags]._props.Cartridges[0]._props.filters[0].Filter.push("366BUCKSHOT");
        database.templates.items[mags]._props.Cartridges[0]._props.filters[0].Filter.push("366DGW");
        //    logger.log("Pushed " + "366FLECHETTE to " + mags, "cyan");
        //  logger.log("Pushed " + "366BUCKSHOT to " + mags, "cyan");
        //    logger.log("Pushed " + "366DGW to " + mags, "cyan");
    }
    for (const wp of _366weapons) {
        database.templates.items[wp]._props.Chambers[0]._props.filters[0].Filter.push("366FLECHETTE");
        database.templates.items[wp]._props.Chambers[0]._props.filters[0].Filter.push("366BUCKSHOT");
        database.templates.items[wp]._props.Chambers[0]._props.filters[0].Filter.push("366DGW");
        database.templates.items[wp]._props.shotgunDispersion = 4;
        //  logger.log("Pushed " + "366FLECHETTE to " + wp, "blue");
        //  logger.log("Pushed " + "366BUCKSHOT to " + wp, "blue");
        //    logger.log("Pushed " + "366DGW to " + wp, "blue");
    }
    const isModFilterExist1 = (slots) => slots.findIndex((slot) => slot._name === "mod_mount");
    const isModFilterExist2 = (slots) => slots.findIndex((slot) => slot._name === "mod_scope");
    const isModFilterExist3 = (slots) => slots.findIndex((slot) => slot._name === "mod_tactical_000");
    const isModFilterExist4 = (slots) => slots.findIndex((slot) => slot._name === "mod_sight_rear");
    const isModFilterExist5 = (slots) => slots.findIndex((slot) => slot._name === "mod_mount_000");
    const isItemSlotsExist = (item) => item._props.Slots && item._props.Slots.length > 0;
    const filtersIncludeAttachment = (filterArray) => filterArray.includes("5649a2464bdc2d91118b45a8");
    const filtersIncludeAttachment2 = (filterArray) => filterArray.includes("5c5952732e2216398b5abda2");
    const filtersIncludeAttachment3 = (filterArray) => filterArray.includes("5ba26b17d4351e00367f9bdd");
    const filtersIncludeAttachment4 = (filterArray) => filterArray.includes("618a75c9a3884f56c957ca1b");
    const filtersIncludeAttachment5 = (filterArray) => filterArray.includes("626bb8532c923541184624b4");
    const filtersIncludeAttachment6 = (filterArray) => filterArray.includes("5dff772da3651922b360bf91");
    for (const item of Object.values(tables.templates.items)) {
        if (isItemSlotsExist(item)) {
            const index1 = isModFilterExist1(item._props.Slots);
            const index2 = isModFilterExist2(item._props.Slots);
            const index3 = isModFilterExist3(item._props.Slots);
            const index4 = isModFilterExist4(item._props.Slots);
            const index5 = isModFilterExist5(item._props.Slots);
            if (index1 > -1 && item._name != "mount_all_ncstar_mpr45" && filtersIncludeAttachment(item._props.Slots[index1]._props.filters[0].Filter)) {
                item._props.Slots[index1]._props.filters[0].Filter.push("NCSTARLONG_RIGHT");
                item._props.Slots[index1]._props.filters[0].Filter.push("NCSTARLONG_LEFT");
                item._props.Slots[index1]._props.filters[0].Filter.push("Leftmount_all_ncstar_mpr45");
                //        logger.log(item._props.Name + " - - - - i1 ", "yellow");
            }
            if (index2 > -1 && item._name != "mount_all_ncstar_mpr45" && filtersIncludeAttachment2(item._props.Slots[index2]._props.filters[0].Filter)) {
                item._props.Slots[index2]._props.filters[0].Filter.push("NCSTARLONG_RIGHT");
                item._props.Slots[index2]._props.filters[0].Filter.push("NCSTARLONG_LEFT");
                item._props.Slots[index2]._props.filters[0].Filter.push("Leftmount_all_ncstar_mpr45");
                item._props.Slots[index2]._props.filters[0].Filter.push("5649a2464bdc2d91118b45a8");
                //      logger.log(item._props.Name + " - - - - i2 ", "yellow");
            }
            if (index2 > -1 && item._name != "mount_all_ncstar_mpr45" && filtersIncludeAttachment(item._props.Slots[index2]._props.filters[0].Filter)) {
                item._props.Slots[index2]._props.filters[0].Filter.push("NCSTARLONG_RIGHT");
                item._props.Slots[index2]._props.filters[0].Filter.push("NCSTARLONG_LEFT");
                item._props.Slots[index2]._props.filters[0].Filter.push("Leftmount_all_ncstar_mpr45");
                item._props.Slots[index2]._props.filters[0].Filter.push("5649a2464bdc2d91118b45a8");
                //      logger.log(item._props.Name + " - - - - i3 ", "yellow");
            }
            if (index3 > -1 && filtersIncludeAttachment2(item._props.Slots[index3]._props.filters[0].Filter)) {
                item._props.Slots[index3]._props.filters[0].Filter.push("NCSTARLONG_RIGHT");
                item._props.Slots[index3]._props.filters[0].Filter.push("NCSTARLONG_LEFT");
                item._props.Slots[index3]._props.filters[0].Filter.push("Leftmount_all_ncstar_mpr45");
                item._props.Slots[index3]._props.filters[0].Filter.push("5649a2464bdc2d91118b45a8");
                //      logger.log(item._props.Name + " - - - - i4 ", "yellow");
            }
            if (index4 > -1 && filtersIncludeAttachment3(item._props.Slots[index4]._props.filters[0].Filter)) {
                item._props.Slots[index4]._props.filters[0].Filter.push("NCSTARLONG_RIGHT");
                item._props.Slots[index4]._props.filters[0].Filter.push("NCSTARLONG_LEFT");
                item._props.Slots[index4]._props.filters[0].Filter.push("Leftmount_all_ncstar_mpr45");
                item._props.Slots[index4]._props.filters[0].Filter.push("5649a2464bdc2d91118b45a8");
                //    logger.log(item._props.Name + " - - - - i5 ", "yellow");
            }
            if (index1 > -1 && filtersIncludeAttachment4(item._props.Slots[index1]._props.filters[0].Filter)) {
                item._props.Slots[index1]._props.filters[0].Filter.push("KobraPicatinny");
                //    logger.log(item._props.Name + " - - - - i6 ", "yellow");
            }
            if (index5 > -1 && filtersIncludeAttachment4(item._props.Slots[index5]._props.filters[0].Filter)) {
                item._props.Slots[index5]._props.filters[0].Filter.push("KobraPicatinny");
                //      logger.log(item._props.Name + " - - - - i7 ", "yellow");
            }
            if (index2 > -1 && filtersIncludeAttachment4(item._props.Slots[index2]._props.filters[0].Filter)) {
                item._props.Slots[index2]._props.filters[0].Filter.push("KobraPicatinny");
                //    logger.log(item._props.Name + " - - - - i8 ", "yellow");
            }
            if (index2 > -1 && filtersIncludeAttachment5(item._props.Slots[index2]._props.filters[0].Filter)) {
                item._props.Slots[index2]._props.filters[0].Filter.push("vortex_spitfire_hd_x3");
                item._props.Slots[index2]._props.filters[0].Filter.push("vortex_spitfire_hd_x5");
                item._props.Slots[index2]._props.filters[0].Filter.push("monstrum3x");
                item._props.Slots[index2]._props.filters[0].Filter.push("monstrum3x_tan");
                //      logger.log(item._props.Name + " - - - - i3 ", "yellow");
            }
            if (index2 > -1 && filtersIncludeAttachment6(item._props.Slots[index2]._props.filters[0].Filter)) {
                item._props.Slots[index2]._props.filters[0].Filter.push("PPT");
                //      logger.log(item._props.Name + " - - - - i3 ", "yellow");
            }
        }
    }
}
// add the code below
module.exports = { execute };
