'use strict'

var db = require("../config/kyjdb");
var logger = require('../config/logger');

function admin_list(parameters){
    return new Promise(function (resolve, reject) {
        let queryData = `SELECT * FROM User WHERE role = 5`;
        db.query(queryData, function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [User]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}
function admin_update(parameters){
    return new Promise(function (resolve, reject) {
        let queryData = `UPDATE User SET role = 1 WHERE userId=?`;
        db.query(queryData, [parameters.userId], function (error, db_data){
            if(error){
                logger.error(
                    "DB error [User]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            console.log(db_data);
            resolve('업데이트 완료')
        })
    })
}

module.exports = {
    admin_list,
    admin_update
}