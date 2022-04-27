'use strict';

var db = require("../../config/kyjdb");
var logger = require('../../config/logger');


function researchResults_selectDetailPatent(parameters) {
    var queryData = `SELECT * FROM Research_Results_Patent where rrid="${parameters.rrid}"`;
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
function researchResults_selectPatent(parameters) {
    var queryData = `SELECT * FROM Research_Results_Patent`
    if (parameters.search !== '') {
        queryData += ` WHERE (title_ko LIKE '%${parameters.search}%')`;
    }
    queryData += ` ORDER BY application_date desc`;
    if (!(parameters.limit == undefined)) queryData += ` LIMIT 0,${parameters.limit}`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Patent]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function researchResults_DeletePatent(parameters) {
    let queryData = `DELETE FROM Research_Results_Patent WHERE rrid = '${parameters.rrid}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Patent]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('삭제가 완료되었습니다.')
        })
    })
}
function researchResults_InsertPatent(parameters) {
    let queryData = `INSERT Research_Results_Patent SET group_id=?, classify_ko=?,title_ko=?,writer_ko=?,announe_nation_ko=?,registration_num=?,registration_date=?,application_date=?,application_num=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.group_id, parameters.classify_ko, parameters.title_ko, parameters.writer_ko, parameters.announe_nation_ko, parameters.registration_num, parameters.registration_date, parameters.application_date, parameters.application_num], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Patent]" +
                    "\n \t" + queryData +
                    "\n \t" + error
                )
                reject('DB ERR');
            }
            resolve('데이터 추가 완료');
        })
    })
}
function researchResults_ModifyPatent(parameters) {
    let queryData = `UPDATE Research_Results_Patent SET group_id=?, classify_ko=?,title_ko=?,writer_ko=?,announe_nation_ko=?,registration_num=?,registration_date=?,application_date=?,application_num=? WHERE rrid=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.group_id, parameters.classify_ko, parameters.title_ko, parameters.writer_ko, parameters.announe_nation_ko, parameters.registration_num, parameters.registration_date, parameters.application_date, parameters.application_num, parameters.rrid], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Results_Patent]" +
                    "\n \t" + queryData +
                    "\n \t" + error
                )
                reject('DB ERR');
            }
            resolve('데이터 수정 완료');
        })
    })
}



module.exports = {
    researchResults_selectDetailPatent,
    researchResults_selectPatent,
    researchResults_DeletePatent,
    researchResults_InsertPatent,
    researchResults_ModifyPatent
}