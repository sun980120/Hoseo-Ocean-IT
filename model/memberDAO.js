'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');

function Member_selectAll(parameters) {
    return new Promise(function (resolve, reject) {
        //SELECT * FROM Member LEFT OUTER JOIN Member_Career ON Member.mid = Member_Career.mid
        var queryData = `SELECT DISTINCT * FROM  Member left JOIN Member_Career ON Member.mid = Member_Career.mid`
        if(!(parameters==undefined)) queryData+=` LIMIT 0,${parameters.limit}`
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Research_Fields]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            if(db_data === undefined)
                reject("<script>" +
                "alert('No Data');" +
                "window.history.go(-1);"+
                "</script>");
            resolve(db_data);
        });
    })
}

module.exports = {
    Member_selectAll
}