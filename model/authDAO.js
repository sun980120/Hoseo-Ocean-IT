'use strict';

var db = require("../config/kyjdb");
var logger = require('../config/logger');
var crypto = require('crypto')
var dayjs = require('dayjs')

function insertUser(parameters) {
    console.log(parameters)
    return new Promise(function (resolve, reject) {
        db.query(`SELECT * FROM User WHERE userId="${parameters.userId}"`, function (error, db_data) {
            if (db_data[0] != null) {
                return reject('DB ERR')
            } else {
                var date = new dayjs();
                var datetime = date.format('YYYY-MM-DD HH:mm:ss');
                const userObj = {
                    userId: parameters.userId,
                    userPw: crypto.createHash('sha512').update(parameters.userPw).digest('base64'),
                    userName: parameters.userName,
                    userEmail: parameters.userEmail,
                    userPosition: parameters.userPosition,
                    userBelong: parameters.userBelong,
                    userDepartment: parameters.userDepartment,
                    createDate: datetime,
                }
                db.query(`INSERT INTO User SET ? `, userObj, function (error, user) {
                    if (error) {
                        logger.error(
                            "DB error [User]" +
                            "\n \t" + user +
                            "\n \t" + error);
                        reject('DB ERR');
                    }
                    resolve(user);
                })
            }
            resolve(db_data);
        })
    })
}
function checkUser(parameters) {
    const queryData = `SELECT * FROM User WHERE userId="${parameters.userId}" && userPw="${crypto.createHash('sha512').update(parameters.userPw).digest('base64')}"`
    return new Promise(function (resolve, reject) {
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [User]" +
                    "\n \t" + db_data +
                    "\n \t" + error);
                reject('DB ERR');

            }
            if (db_data[0] !== undefined) resolve(db_data[0])
            else reject("아이디 혹은 비밀번호를 다시 확인하세요.")
        })
    })
}
function updateToUser(parameters) {
    var date = new dayjs();
    var datetime = date.format('YYYY-MM-DD HH:mm:ss');
    const userObj = {
        userPw: crypto.createHash('sha512').update(parameters.userPw).digest('base64'),
        userName: parameters.userName,
        userEmail: parameters.userEmail,
        userNameEn: parameters.userNameEN,
        userPhone: parameters.userPhone,
        userAdd: parameters.userAdd,
        userImg: parameters.userImg,
        changeDate: datetime,
    }
    return new Promise(function (resolve, reject) {
        db.query(`UPDATE User SET ? WHERE userId="${parameters.userId}"`, userObj, function (error, user) {
            if (error) {
                logger.error(
                    "DB error [User]" +
                    "\n \t" + error);
                reject('DB ERR');
                //throw error;
            }
            resolve('업데이트 완료');
        })
    })
}
function androidUser(parameters) {
    return new Promise(function (resolve, reject) {
        var queryData = `UPDATE User Set Token=? WHERE userId="${parameters.userId}"`
        db.query(queryData, [parameters.Token], function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [User]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            resolve('업데이트 완료')
        })
    })
}
function checkUserToken(parameters) {
    console.log(parameters.Token)
    return new Promise(function (resolve, reject) {
        var queryData = `SELECT Token FROM User WHERE Token="${parameters.Token}"`;
        db.query(queryData, function (error, db_data) {
            if (error) {
                logger.error(
                    "DB error [User]" +
                    "\n \t" + queryData +
                    "\n \t" + error);
                reject('DB ERR');
            }
            console.log(db_data[0])
            if (db_data[0] == undefined) reject(1) //토큰이 존재하지 않습니다
            // else resolve(db_data[0].Token);
        })
    })
}

module.exports = {
    insertUser,
    checkUser,
    updateToUser,
    androidUser,
    checkUserToken,
}