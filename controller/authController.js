'use strict';

// var jwt = require('jsonwebtoken');
var session = require('express-session')
var jwtmiddle = require('../middleware/jwt');
var authDAO = require('../model/authDAO');
var counterDAO = require('../model/counterDAO')
const crypto = require('crypto');

async function signIn(req, res, next) {
    let token = req.session.user;
    let userId = ""
    try {
        if (token !== undefined) throw "접근할수 없습니다."
        if (req.cookies['loginId'] !== undefined) {
            userId = req.cookies['loginId']
        }
        res.render('auth/signIn', { userId: userId });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}

async function checkUser(req, res, next) {
    var special_pattern = /[` ~!@#$%^&*|\\\'\";:\/?]/gi;
    let parameters = {
        "userId": req.body.inputID,
        "userPw": req.body.inputPW,
    }
    try {
        if (special_pattern.test(req.body.inputID) ||
            req.body.inputID == undefined || req.body.inputPW == undefined ||
            req.body.inputID == " " || req.body.inputPW == " " ||
            req.body.inputID == null || req.body.inputPW == null) {
            throw "잘못된 값을 입력하셨습니다."
        }
        const db_data = await authDAO.checkUser(parameters);
        if (db_data.role == 5) throw "권한이 없습니다."
        var userData = {
            userId: db_data.userId,
            userName: db_data.userName,
            userEmail: db_data.userEmail,
            userRole: db_data.role,
        }
        const token = await jwtmiddle.jwtCreate(userData)

        req.session.user = token;

        if (req.body.rememberId == "checked") res.cookie('loginId', req.body.inputID);
        else res.clearCookie('loginId')

        res.redirect("/")

    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}
async function revise_check(req, res, next) {
    let token = req.session.user;
    var queryPage = req.query.page;
    var parameters = {
        "page": queryPage,
        "name": 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        res.render('auth/revise_check', { permission, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "'); history.go(-1);</script>")
    }
}
async function revise_check_post(req, res, next) {
    let token = req.session.user;
    var queryPage = req.query.page;
    let parameters = {
        "page": queryPage,
        "name": 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);

        parameters.userId = permission.userId
        parameters.userPw = req.body.inputPW

        const db_data = await authDAO.checkUser(parameters);
        console.log(db_data)

        res.render('auth/revise', { db_data, permission, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}

async function updateUser(req, res, next) {
    let token = req.cookies.user
    var file = req.file;

    if (req.body.inputPw.length < 6) {
        return res.send("<script>alert('비밀번호를 6자 이상 입력해주세요.'); history.go(-1);</script>")
    }
    if (req.body.inputPw !== req.body.checkPw) {
        return res.send("<script>alert('비밀번호가 일치하지 않습니다.'); history.go(-1);</script>")
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        let parameters = {
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
        if (file != undefined) parameters.userImg = file.filename
        else parameters.userImg = null
        const db_data = await authDAO.updateToUser(parameters);
        res.redirect("/auth/logout")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}
function signUp(req, res, next) {
    let token = req.session.user;

    if (token !== undefined) {
        return res.send("<script>alert('접근할수 없습니다.'); location.href='/'; </script>")
    }
    res.render('auth/signUp');
}
async function signUpPost(req, res, next) {
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
    try {
        await authDAO.insertUser(parameters)
        res.send("<script>alert('계정 생성에 성공하였습니다.');location.href='/auth/sign/in';</script>");
    } catch (error) {
        res.send("<script>alert('jwt err'); history.go(-1);</script> ")
    }
}

function logOut(req, res, next) {
    let token = req.session.user;
    res.clearCookie('user');
    req.session.destroy(function () {
        res.redirect('/');
    })
}

//안드로이드 로그인 && 자동로그인
async function androidLogin(req, res, next) {
    if (req.body.userId === undefined || req.body.userPw === undefined) {
        res.json({ "message": "Parameter ERR." })
        return;
    }
    let parameters = {
        "userId": req.body.userId,
        "userPw": req.body.userPw,
    }
    try {
        const findUserData = await authDAO.checkUser(parameters);
        parameters = {
            userId: findUserData.userId,
            userName: findUserData.userName,
            userEmail: findUserData.userEmail,
            userNameEN: findUserData.userNameEN,
            userAdd: findUserData.userAdd,
            userPhone: findUserData.userPhone,
            userImg: findUserData.userImg,
            userBelong: findUserData.userBelong,
            userDepartment: findUserData.userDepartment,
            userPosition: findUserData.userPosition,
        }
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
        const jwtCreateANDROID = await jwtmiddle.jwtCreateANDROID(userData);
        res.cookie("user", jwtCreateANDROID)
        parameters.Token = jwtCreateANDROID
        const jwtUpdate = await authDAO.androidUser(parameters)

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
    } catch (error) {
        res.status(200).json({
            "userId": "",
            "userName": "",
            "userEmail": "",
            "userNameEN": "",
            "userAdd": "",
            "userPhone": "",
            "userImg": "",
            "message": error
        })
    }
}
async function checkToken(req, res, next) {

    // var queryToken = req.body.token;
    var queryToken = req.get('token')

    var parameters = {
        "Token": queryToken
    }
    try {
        if (queryToken == undefined) throw "Parameter ERR."
        // const db_data = await authDAO.checkUserToken(parameters);
        const permission = await jwtmiddle.jwtCerti(parameters.Token)
        res.json({ "message": "성공" })
    } catch (error) {
        if (error) res.status(500).json({ "message": "토큰이 존재하지 않습니다." })
        else res.status(403).json({ "message": "토큰이 만료되었습니다." })
    }
}
async function updateUserApp(req, res, next){
    // let token = req.cookies.user
    let token = req.get('token')
    try {
        if(token == undefined) throw "Parameter ERR."
        if (req.body.inputPw.length < 6) throw "비밀번호를 6자 이상 입력해주세요."
        if (req.body.inputPw !== req.body.checkPw) throw "비밀번호가 일치하지 않습니다."

        const permission = await jwtmiddle.jwtCerti(token);
        let parameters = {
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
            userImg: null
        }

        const db_data = await authDAO.updateToUser(parameters);
        res.json({
            "Message" : "회원정보 변경이 성공하였습니다."
        })
    } catch (error) {
        res.json({
            "Message" : "회원정보 변경이 실패하였습니다.",
            "Error_Message": error,
        })
    }
}
async function Apprevise_check_post(req, res, next) {
    let token = req.get('token')
    console.log(req.body)
    let parameters = {
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);

        parameters.userId = permission.userId
        parameters.userPw = req.body.userPW
        console.log(parameters)
        const db_data = await authDAO.checkUser(parameters);
        console.log(db_data)

        res.json({"Message":"성공하였습니다."})
    } catch (error) {
        res.json({"Message":"실패하였습니다."})
    }
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
    updateUserApp,
    Apprevise_check_post,
}