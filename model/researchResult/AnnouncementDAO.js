'use strict';

var db = require("../../config/kyjdb");
var logger = require('../../config/logger');

function researchResults_selectDetailAnnouncement(parameters) {
    var queryData = `SELECT * FROM Research_Results_Announcement where rrid="${parameters.rrid}"`;

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
function researchResults_selectAnnouncement(parameters) {
    var queryData = `SELECT * FROM Research_Results_Announcement`
    if (parameters.search !== '') {
        queryData += ` WHERE (title_ko LIKE '%${parameters.search}%')`;
    }
    queryData += ` ORDER BY application_date desc`;
    if (!(parameters.limit == undefined)) queryData += ` LIMIT 0,${parameters.limit}`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Announcement]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function researchResults_DeleteAnnouncement(parameters) {
    let queryData = `DELETE FROM Research_Results_Announcement WHERE rrid = '${parameters.rrid}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Announcement]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('삭제가 완료되었습니다.')
        })
    })
}
function researchResults_InsertAnnouncement(parameters) {
    let queryData = `INSERT Research_Results_Announcement SET title_ko=?,classify_ko=?,announe_nation_ko=?,writer_ko=?,application_date=?,academic_ko=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.title_ko, parameters.classify_ko, parameters.announe_nation_ko, parameters.writer_ko, parameters.application_date, parameters.academic_ko], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Announcement]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 추가 완료');
        })
    })
}
function researchResults_ModifyAnnouncement(parameters){
    let queryData = `UPDATE Research_Results_Announcement SET title_ko=?,classify_ko=?,announe_nation_ko=?,writer_ko=?,application_date=?,academic_ko=? WHERE rrid=?`
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.title_ko, parameters.classify_ko, parameters.announe_nation_ko, parameters.writer_ko, parameters.application_date, parameters.academic_ko, parameters.rrid], function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Research_Results_Announcement]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 수정 완료');
        })
    })
}

module.exports = {
    researchResults_selectDetailAnnouncement,
    researchResults_selectAnnouncement,
    researchResults_DeleteAnnouncement,
    researchResults_InsertAnnouncement,
    researchResults_ModifyAnnouncement
}