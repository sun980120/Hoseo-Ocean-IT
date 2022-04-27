'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');

function findCount(parameters) {
    var queryData = `SELECT * FROM Counter WHERE name="${parameters.name}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Counter]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(db_data)
        })
    })
}
function insertCount(parameters) {
    var queryData = `INSERT INTO Counter SET ?`
    return new Promise(function (resolve, reject) {
        db.query(queryData, parameters, function (error, counterData) {
            if (error) {
                logger.error(
                    "DB error [Counter]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(counterData);
        })
    })
}
function updateCount(db_data) {
    var queryData = `UPDATE Counter SET totalCount=?, todayCount=? WHERE name="${db_data.name}"`
    return new Promise(function (resolve, reject) {
        db.query(queryData,[db_data.totalCount+1,db_data.todayCount+1],function (error, Update){
            if (error) {
                logger.error(
                    "DB error [Counter]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(Update);
        })
    })
}
function newUpdateCount(db_data){
    var queryData = `UPDATE Counter SET totalCount=?, todayCount=?,date=? WHERE name="${db_data.name}"`
    return new Promise(function (resolve, reject) {
        db.query(queryData,[db_data.totalCount++,1,db_data.date],function (error, newUpdate){
            if (error) {
                logger.error(
                    "DB error [Counter]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve(newUpdate);
        })
    })
}

module.exports = {
    findCount,
    insertCount,
    updateCount,
    newUpdateCount
}