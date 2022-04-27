'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');

function gallery_selectAll(parameters) {
    return new Promise(function (resolve, reject) {
        db.query(`SELECT * FROM Gallery`, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Gallery]"+
                    "\n \t" + `SELECT * FROM Gallery` +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}

function gallery_selectOneDetail(parameters) {
    return new Promise(function (resolve, reject) {
        var queryData = `SELECT * FROM Gallery where gid = '${parameters.gid}'`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Gallery]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            // console.log(db_data)
            resolve(db_data);
        });
    })
}
module.exports = {
    gallery_selectAll,
    gallery_selectOneDetail
}
