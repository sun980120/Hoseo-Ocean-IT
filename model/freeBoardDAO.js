'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');


function count_freeBoard(parameters){
    return new Promise(function(resolve,reject){
        let queryData = `SELECT * FROM Free_Board ORDER BY date desc`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Free_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        })
    })
}function count_freeBoardDetail(parameters){
    var queryData = `SELECT * FROM Free_Board where qid="${parameters.qid}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Free_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function count_freeBoardComment(parameters){
    var queryData = `SELECT * FROM freeBoardComment where qid="${parameters.qid}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [freeBoardComment]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function insert_freeBoardComment(parameters){
    let queryData = `INSERT freeBoardComment SET qid=?, comment=?, date=?, userId=?, userName=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.qid, parameters.comment, parameters.date, parameters.userId, parameters.userName], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [freeBoardComment]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve('댓글 데이터 추가 완료');
        })
    })
}
function update_freeBoard(parameters){
    let queryData = `UPDATE Free_Board SET title=?, content=?,date=? where qid='${parameters.qid}' AND userId='${parameters.userId}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData,[parameters.title, parameters.content, parameters.date] ,function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Free_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve('수정완료')
        })
    })
}
function insert_freeBoard(parameters){
    let queryData = `INSERT INTO Free_Board SET ?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, parameters, function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Free_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve('데이터 추가 완료')
        })
    })
}
function delete_freeBoard_admin(parameters){
    let queryData = `DELETE FROM Free_Board WHERE qid='${parameters.qid}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Free_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            if(db_data.affectedRows == 0) reject('Permission ERR');
            else resolve('삭제 성공하였습니다.')
        })
    })
}
function delete_freeBoard_user(parameters){
    let queryData = `DELETE FROM Free_Board WHERE qid='${parameters.qid}' AND userId = '${parameters.userId}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData,function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Free_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            if(db_data.affectedRows == 0) reject('Permission ERR');
            else resolve('삭제 성공하였습니다.')
        })
    })
}

module.exports = {
    count_freeBoard,
    count_freeBoardDetail,
    count_freeBoardComment,
    insert_freeBoardComment,
    update_freeBoard,
    insert_freeBoard,
    delete_freeBoard_admin,
    delete_freeBoard_user
}
