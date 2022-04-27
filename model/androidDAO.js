'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');

//android
function androidDetail() {
    var queryData = `SELECT rfid,research_content_ko,research_name_ko FROM Research_Fields ORDER BY date_start desc LIMIT 1`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                console.log("db_data : ")
                console.log(db_data)
                logger.error(
                    "DB error [Research_Fields]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}
function androidPhoto(rfid){
    var queryData = `SELECT img_src FROM Research_Fields_Photos WHERE rfid='${rfid}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                console.log("db_data : ")
                console.log(db_data)
                logger.error(
                    "DB error [Research_Fields]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}
module.exports = {
    androidDetail,
    androidPhoto
}
