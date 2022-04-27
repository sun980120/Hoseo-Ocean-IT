'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');

function count_questionBoard(parameters) {
    let queryData = `SELECT * FROM Inquiry_Board ORDER BY date desc`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Inquiry_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function count_questionBoardDetail(parameters){
    var queryData = `SELECT * FROM Inquiry_Board where qid="${parameters.qid}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Inquiry_Board]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function count_questionBoardComment(parameters){
    var queryData = `SELECT * FROM inquiryComment where qid="${parameters.qid}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [inquiryComment]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve(db_data);
        });
    })
}
function insert_inquiryComment(parameters){
    let queryData = `INSERT inquiryComment SET qid=?, comment=?, date=?, userId=?, userName=?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData,[parameters.qid, parameters.comment, parameters.date, parameters.userId, parameters.userName], function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [inquiryComment]"+
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve('댓글 데이터 추가 완료');
        })
    })
}
function update_inquiry(parameters){
    let queryData = `UPDATE Inquiry_Board SET title = ?, content = ?, date = ? WHERE qid="${parameters.qid}" AND userId = "${parameters.userId}"`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, [parameters.title, parameters.content, parameters.date], function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Inquiry_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('수정완료');
        })
    })
}
function insert_inquiry(parameters){
    let queryData = `INSERT INTO Inquiry_Board SET ?`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, parameters, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [Inquiry_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('데이터 추가 완료')
        })
    })
}
function delete_inquiry_admin(parameters){
    let queryData = `DELETE FROM Inquiry_Board WHERE qid= '${parameters.qid}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Inquiry_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 0) reject('Permission ERR');
            else resolve('삭제 성공하였습니다.')
        })
    })
}
function delete_inquiry_user(parameters){
    let queryData = `DELETE FROM Inquiry_Board WHERE qid= '${parameters.qid}' AND userId = '${parameters.userId}'`;
    return new Promise(function (resolve, reject) {
        db.query(queryData,function (error, db_data){
            if (error) {
                logger.error(
                    "DB error [Inquiry_Board]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            if(db_data.affectedRows == 0) reject('Permission ERR');
            else resolve('삭제 성공하였습니다.')
        })
    })
}
module.exports = {
    count_questionBoard,
    count_questionBoardDetail,
    count_questionBoardComment,
    insert_inquiryComment,
    update_inquiry,
    insert_inquiry,
    delete_inquiry_admin,
    delete_inquiry_user
}