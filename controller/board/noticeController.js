'use strict';

var dayjs = require('dayjs');
var jwtmiddle = require('../../middleware/jwt');
var noticeBoardDAO = require('../../model/noticeBoardDAO');
var counterDAO = require('../../model/counterDAO')

async function noticeMain(req, res, next) {
    try {
        let token = req.session.user;
        let queryPage = req.query.page;
        let parameters = {
            "page": queryPage,
            "name": 'vistors'
        }
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const db_data = await noticeBoardDAO.count_noticeBoard(parameters)
        res.render('board/notice/noticeMain', { db_data, dayjs, permission, parameters, count_data })
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

async function noticeMainApp(req, res, next) {
    var queryToken = req.get('token')
    try {
        var parameters = {
            "name": 'vistors'
        }
        let token = req.session.user;
        const db_data = await noticeBoardDAO.count_noticeBoard(parameters)
        const cout_data = await counterDAO.findCount(parameters)
        const permission = await jwtmiddle.jwtCerti(queryToken)
        res.json({
            db_data
        })
    } catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        })
    }
}
async function noticeWrite(req, res, next) {
    try {
        let token = req.session.user
        let parameters = {
            "name":'vistors'
        }
        if(token == undefined) throw "권한이없습니다."
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        if(permission.userRole >= 5) throw "권한이없습니다."
        res.render('board/notice/noticeWrite', { permission, count_data })
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function noticeDetail(req, res, next) {
    try {
        let token = req.session.user
        let queryNum = req.query.num;
        let parameters ={
            "qid" : queryNum,
            "name": 'vistors'
        }
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const detailData = await noticeBoardDAO.count_noticeBoardDetail(parameters)
        res.render('board/notice/noticeDetail',{dayjs, permission, count_data, detailData})
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function noticeModify(req, res, next) {
    try {
        let queryNum = req.query.num;
        let parameters = {
            "qid": queryNum,
            "name": 'vistors',
        }
        console.log(parameters)
        let token = req.session.user;
        if(token == undefined) throw "권한이없습니다."
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const detailData = await noticeBoardDAO.count_noticeBoardDetail(parameters)
        if(permission.userId != detailData[0].userId) throw "권한이 없습니다."
        console.log(detailData)
        res.render('board/notice/noticeModify', {dayjs, permission, count_data, detailData})
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function noticeModifyPost(req, res, next) {
    try {
        let token = req.session.user
        let queryNum = req.query.num;
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss');
        let parameters = {
            "qid": queryNum,
            "date" : datetime,
            "title" :req.body.title,
            "content" : req.body.content,
        }
        if(req.body.title=="") throw "제목을 입력하세요."
        if(req.body.content=="") throw "내용을 입력하세요."
        const permission = await jwtmiddle.jwtCerti(token)
        const update_notice_board = await noticeBoardDAO.update_notice_board(parameters)
        res.redirect('/board/notice?page=1');
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function noticeWritePost(req, res, next) {
    try {
        let token = req.session.user;
        var date = new dayjs();
        var datetime = date.format('YYYY-MM-DD HH:mm:ss');
        let parameters = {
            "title":req.body.title,
            "content": req.body.content,
            "date":datetime
        }
        if(parameters.title == "") throw "제목을 입력하세요."
        if(parameters.content == "") throw "내용을 입력하세요."
        if(token == undefined) throw "권한이 없습니다."
        const permission = await jwtmiddle.jwtCerti(token)
        if(permission.userRole >= 5) throw "권한이없습니다."
        const datas = {
            userId:permission.userId,
            title:parameters.title,
            content:parameters.content,
            date:parameters.date,
            userName:permission.userName,
        }
        const insertNoticeBoard = await noticeBoardDAO.insert_notice_board(datas)
        res.redirect('/board/notice?page=1')
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

async function noticeDelete(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "qid": queryNum
    };
    try {
        let queryToken = req.session.user;
        if (queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        parameters.userId = permission.userId
        
        let delete_notice;
        if(permission.userRole == 0) delete_notice = await noticeBoardDAO.delete_notice_admin(parameters)
        else delete_notice = await noticeBoardDAO.delete_notice_user(parameters)
        res.redirect("/board/notice?page=1")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

module.exports = {
    noticeMain,
    noticeMainApp,
    noticeWrite,
    noticeDetail,
    noticeWritePost,
    noticeModify,
    noticeModifyPost,
    noticeDelete,
}