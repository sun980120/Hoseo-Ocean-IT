'use strict';

var db = require("../../config/kyjdb");
var logger = require('../../config/logger');

function researchResults_selectDetailTreatise(parameters) {
    var queryData = `SELECT * FROM Research_Results_Treatise where rrid="${parameters.rrid}"`;

    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function researchResults_selectTreatise(parameters) {
    var queryData = `SELECT * FROM Research_Results_Treatise`
    if (parameters.search !== '') {
        queryData += ` WHERE (title_ko LIKE '%${parameters.search}%')`;
    }
    queryData += ` ORDER BY application_date desc`;
    if (!(parameters.limit == undefined)) queryData += ` LIMIT 0,${parameters.limit}`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Treatise]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function researchResults_DeleteTreatise(parameters){
    let queryData = `DELETE FROM Research_Results_Treatise WHERE rrid = '${parameters.rrid}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Treatise]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('삭제가 완료되었습니다.')
        })
    })
}
function researchResults_InsertTreatise(parameters){
    let queryData = `INSERT Research_Results_Treatise SET title_ko=?, classify_ko=?, journal_ko=?, media_ko=?, writer_ko=?, group_id=?, application_num=?, application_date=?, announe_nation_ko=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.title_ko,parameters.classify_ko, parameters.journal_ko , parameters.media_ko, parameters.writer_ko, parameters.group_id, parameters.application_num, parameters.application_date,parameters.announe_nation_ko], function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Research_Results_Treatise]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 추가 완료');
        })
    })
}
function researchResults_ModifyTreatise(parameters){
    let queryData = `UPDATE Research_Results_Treatise SET title_ko=?, classify_ko=?, journal_ko=?, media_ko=?, writer_ko=?, group_id=?, application_num=?, application_date=?, announe_nation_ko=? WHERE rrid=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.title_ko,parameters.classify_ko, parameters.journal_ko , parameters.media_ko, parameters.writer_ko, parameters.group_id, parameters.application_num, parameters.application_date,parameters.announe_nation_ko, parameters.rrid], function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Research_Results_Treatise]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 수정 완료');
        })
    })
}

module.exports = {
    researchResults_selectTreatise,
    researchResults_selectDetailTreatise,
    researchResults_DeleteTreatise,
    researchResults_InsertTreatise,
    researchResults_ModifyTreatise
}