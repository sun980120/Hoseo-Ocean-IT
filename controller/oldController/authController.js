'use strict';

// var jwt = require('jsonwebtoken');
var jwtmiddle = require('../middleware/jwt');
var authDAO = require('../model/authDAO');
var counterDAO = require('../model/counterDAO')
const crypto = require('crypto');

function signIn(req, res, next) {
    console.log(req.session)
    let token = req.session.user;
    console.log(token)
    var userId = "";
    if (token !== undefined) {
        return res.send("<script>alert('접근할수 없습니다.'); location.href='/'; </script>")
    }
    if (req.cookies['loginId'] !== undefined) {
        console.log("로그인 정보 있음");
        userId = req.cookies['loginId'];
    }
    res.render('auth/signIn', { userId: userId });
}
function checkUser(req, res, next) {
    var special_pattern = /[` ~!@#$%^&*|\\\'\";:\/?]/gi;
    if (special_pattern.test(req.body.inputID) ||
        req.body.inputID == undefined || req.body.inputPW == undefined ||
        req.body.inputID == " " || req.body.inputPW == " " ||
        req.body.inputID == null || req.body.inputPW == null) {
        res.send("<script>alert('잘못된 값을 입력하셨습니다.'); history.go(-1);</script>")
    } else {
        var parameters = {
            "userId": req.body.inputID,
            "userPw": req.body.inputPW
        }
        authDAO.checkUser(parameters).then(
            (db_data) => {
                if(db_data[0].role==5){
                    return res.send("<script>alert('You do not have permission');location.href='/auth/logout';</script>");
                }
                if (db_data[0] != undefined) {
                    var userData = {
                        userId: db_data[0].userId,
                        userName: db_data[0].userName,
                        userEmail: db_data[0].userEmail,
                        userRole: db_data[0].role,
                    }
                    jwtmiddle.jwtCreate(userData).then(
                        (token) => {
                            if (req.body.rememberId === "checked") {
                                console.log("아이디 저장 체크!");
                                res.cookie('loginId', req.body.inputID);
                            } else {
                                console.log("아이디 저장 해제");
                                res.clearCookie('loginId')
                            }
                            req.session.user = token;
                            console.log(req.session)
                            res.redirect("/")
                        }
                    ).catch(err => res.send("<script>alert('jwt err');history.go(-1);</script>"));
                } else {
                    res.send("<script>alert('JWT is wrong...');history.go(-1);</script>")
                }
            }
        ).catch(err => res.send("<script>alert('" + err + "');history.go(-1);</script>"))
    }
}

function revise_check(req, res, next) {
    let token = req.session.user;
    var queryPage = req.query.page;
    var parameters = {
        "page": queryPage,
        "name": 'vistors'
    }
    counterDAO.findCount(parameters).then(
        (count_data) => {
            jwtmiddle.jwtCerti(token).then(
                (permission) => {
                    res.render('auth/revise_check', { permission,count_data });
                }
            )
    }
    ).catch(err => res.send("<script>alert('jwt err');</script>"));
}

function revise_check_post(req, res, next) {
    let token = req.session.user;

    var queryPage = req.query.page;
    var parameters = {
        "page": queryPage,
        "name": 'vistors'
    }
    counterDAO.findCount(parameters).then(
        (count_data) => {
    jwtmiddle.jwtCerti(token).then(
        (permission) => {
            if (permission != false) {
                var parameters = {
                    "userId": permission.userId,
                    "userPw": req.body.inputPW
                }
                authDAO.checkUser(parameters).then(
                    (db_data) => {
                        console.log(db_data)
                        res.render('auth/revise', { db_data, permission,count_data });
                    }
                ).catch(err => res.send("<script>alert('" + err + "');location.href='/auth/revise_check';</script>"))
            }
            else
                res.send("<script>alert('세션이 만료되었습니다.'); location.href='/'; </script>")
        }
    )}
    ).catch(err => res.send("<script>alert('jwt err');</script>"));
}

function updateUser(req, res, next) {
    let token = req.cookies.user
    var file = req.file;
    console.log(req.body)
    if (req.body.inputPw.length < 6) {
        return res.send("<script>alert('비밀번호를 6자 이상 입력해주세요.'); history.go(-1);</script>")
    }
    if (req.body.inputPw !== req.body.checkPw) {
        return res.send("<script>alert('비밀번호가 일치하지 않습니다.'); history.go(-1);</script>")
    }
    jwtmiddle.jwtCerti(token).then(
        (permission) => {
            const parameters = {
                userId: permission.userId,
                userPw: req.body.inputPw,
                userName: req.body.inputName,
                userPosition: req.body.Position,
                userBelong: req.body.Belong,
                userDepartment: req.body.Department,
                userEmail: req.body.userEmail,
                userNameEN: req.body.inputNameEN,
                userPhone: req.body.inputPhone,
                userAdd: req.body.inputAdd,
            }
            console.log(file)
            if (file != undefined) {
                parameters.userImg = file.filename
            }
            else {
                parameters.userImg = null
            }
            authDAO.updateToUser(parameters).then(
                () => {
                    res.redirect("/auth/logout")
                }
            ).catch(err => res.send("<script>alert('jwt err');history.go(-1);</script>"))
        }
    )
}

function signUp(req, res, next) {
    let token = req.session.user;

    if (token !== undefined) {
        return res.send("<script>alert('접근할수 없습니다.'); location.href='/'; </script>")
    }
    res.render('auth/signUp');
}
function signUpPost(req, res, next) {
    if (!isNaN(req.body.inputID)) {
        return res.send("<script>alert('잘못된 아이디 값을 입력하셨습니다.'); history.go(-1);</script>")
    }
    if (req.body.inputPW.length < 6) {
        return res.send("<script>alert('비밀번호를 6자 이상 입력해주세요.'); history.go(-1);</script>")
    }
    if (req.body.inputPW !== req.body.Pwcheck) {
        return res.send("<script>alert('비밀번호가 일치하지 않습니다..'); history.go(-1);</script>")
    }
    let parameters = {
        userId: req.body.inputID,
        userPw: req.body.inputPW,
        userName: req.body.Name,
        userPosition: req.body.Position,
        userBelong: req.body.Belong,
        userDepartment: req.body.Department,
        userEmail: req.body.Email
    }
    authDAO.insertUser(parameters).then(
        () => {
            res.send("<script>alert('계정 생성에 성공하였습니다.');location.href='/auth/sign/in';</script>");
        }
    ).catch(err => res.send("<script>alert('jwt err'); history.go(-1);</script> "))
}

function logOut(req, res, next) {
    let token = req.session.user;
    res.clearCookie('user');
    req.session.destroy(function(){
        res.redirect('/');
    })
}

//안드로이드 로그인 && 자동로그인
function androidLogin(req, res, next) {
    if (req.body.userId === undefined || req.body.userPw === undefined) {
        res.json({ "message": "Parameter ERR." })
        return;
    }
    var parameters = {
        "userId": req.body.userId,
        "userPw": req.body.userPw,
    }
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return authDAO.checkUser(parameters)
                    .then((findUserData) => {
                        parameters.userId = findUserData[0].userId
                        parameters.userName = findUserData[0].userName
                        parameters.userEmail = findUserData[0].userEmail
                        parameters.userNameEN = findUserData[0].userNameEN
                        parameters.userAdd = findUserData[0].userAdd
                        parameters.userPhone = findUserData[0].userPhone
                        parameters.userImg = findUserData[0].userImg
                        parameters.userBelong = findUserData[0].userBelong
                        parameters.userDepartment = findUserData[0].userDepartment
                        parameters.userPosition = findUserData[0].userPosition
                        return (findUserData)
                    })
                    .then(() => { return db_values; })
            }
        )
        .then(
            () => {
                console.log(parameters)
                var userData = {
                    "userId": parameters.userId,
                    "userName": parameters.userName,
                    "userEmail": parameters.userEmail,
                    "userNameEN": parameters.userNameEN,
                    "userBelong": parameters.userBelong,
                    "userDepartment": parameters.userDepartment,
                    "userPosition": parameters.userPosition,
                    "userAdd": parameters.userAdd,
                    "userPhone": parameters.userPhone,
                    "userImg": parameters.userImg,
                }
                return jwtmiddle.jwtCreateANDROID(userData)
                    .then((jwtCreateANDROID) => {
                        console.log(jwtCreateANDROID)
                        res.cookie("user", jwtCreateANDROID)
                        parameters.Token = jwtCreateANDROID
                        return (jwtCreateANDROID)
                    })
            }
        )
        .then(
            () => {
                return authDAO.androidUser(parameters)
            }
        )
        .then(() => {
            res.json({
                "userId": parameters.userId,
                "userName": parameters.userName,
                "userEmail": parameters.userEmail,
                "userNameEN": parameters.userNameEN,
                "userBelong": parameters.userBelong,
                "userDepartment": parameters.userDepartment,
                "userPosition": parameters.userPosition,
                "userAdd": parameters.userAdd,
                "userPhone": parameters.userPhone,
                "userImg": parameters.userImg,
                "Token": parameters.Token,
                "message": "정상적으로 로그인 되었습니다."
            })
        })
        .catch((err) => {
            res.status(200).json({
                "userId": "",
                "userName": "",
                "userEmail": "",
                "userNameEN": "",
                "userAdd": "",
                "userPhone": "",
                "userImg": "",
                "message": err
            })
        })
}
function checkToken(req, res, next) {
    if (req.body.token === undefined) {
        res.json({ "message": "Parameter ERR." })
        return;
    }
    var queryToken = req.body.token;
    var parameters = {
        "Token": queryToken
    }
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return authDAO.checkUserToken(parameters).then(
                    (db_data) => {
                        db_values.Token = db_data
                    }
                )
            }
        )
        .then(
            () => {
                return jwtmiddle.jwtCerti(db_values.Token)
            }
        )
        .then(() => {
            res.json({ "message": "성공" })
        })
        .catch(err => {
            if (err) //존재하지 않을 때
                res.status(500).json({ "message": "토큰이 존재하지 않습니다." })
            else
                res.status(403).json({ "message": "토큰이 만료되었습니다." })
        })
}

module.exports = {
    signUp,
    signUpPost,
    signIn,
    checkUser,
    revise_check,
    revise_check_post,
    updateUser,
    logOut,
    androidLogin,
    checkToken,
}