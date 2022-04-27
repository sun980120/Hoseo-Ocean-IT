'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');

function count_noticeBoard(parameters) {
    return new Promise(function (resolve, reject) {
        let queryData = `SELECT * From Notice_Board ORDER BY date desc`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Notice_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}
function count_noticeBoardDetail(parameters){
    var queryData = `SELECT * FROM Notice_Board where qid="${parameters.qid}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Notice_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function count_noticeBoardApp(parameters){
    let queryData = `SELECT * FROM Notice_Board ORDER BY date desc LIMIT 1`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Notice_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}
function select_notcieBoardApp(parameters){
    let queryData = `SELECT userName, title, content, date FROM Notice_Board ORDER BY date desc LIMIT 10`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Notice_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}
function update_notice_board(parameters){
    return new Promise(function (resolve, reject) {
        let queryData = `UPDATE Notice_Board SET title=?, content=?,date=? where qid=${parameters.qid}`;
        db.query(queryData, [parameters.title, parameters.content, parameters.date], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Notice_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 입력 완료');
        })
    })
}
function insert_notice_board(parameters){
    return new Promise(function (resolve, reject) {
        let queryData = `INSERT INTO Notice_Board SET ?`;
        db.query(queryData, parameters ,function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Notice_Board]" +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 입력 완료')
        })
    })
}
function delete_notice_admin(parameters){
    return new Promise(function (resolve, reject) {
        let queryData = `DELETE FROM Notice_Board WHERE qid='${parameters.qid}'`;
        db.query(queryData ,function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Notice_Board]" +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 0) reject('Permission ERR');
            else resolve('삭제 성공하였습니다.')
        })
    })
}
function delete_notice_user(parameters){
    return new Promise(function (resolve, reject) {
        let queryData = `DELETE FROM Notice_Board WHERE qid='${parameters.qid}' AND userId = '${parameters.userId}'`;
        db.query(queryData ,function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Notice_Board]" +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 0) reject('Permission ERR');
            else resolve('삭제 성공하였습니다.')
        })
    })
}

module.exports = {
    count_noticeBoard,
    count_noticeBoardDetail,
    count_noticeBoardApp,
    select_notcieBoardApp,
    delete_notice_admin,
    delete_notice_user,
    update_notice_board,
    insert_notice_board,
}