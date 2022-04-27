'use strict';

var dayjs = require('dayjs');
const db = require('../../config/kyjdb');
var jwtmiddle = require('../../middleware/jwt');
var inquiryBoardDAO = require('../../model/inquiryBoardDAO');
var counterDAO = require('../../model/counterDAO')
var logger = require('../../config/logger');

async function inquiryMain(req, res, next) {
    try {
        let token = req.session.user;
        let queryPage = req.query.page;
        let parameters = {
            "page": queryPage,
            'name': 'vistors'
        }
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const db_data = await inquiryBoardDAO.count_questionBoard(parameters)
        res.render('board/inquiry/inquiryMain', { db_data, dayjs, permission, parameters, count_data })
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function inquiryWrite(req, res, next) {
    try {
        let token = req.session.user;
        let parameters = {
            "name": 'vistors'
        }
        if(token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        if(permission.userRole >= 5) throw "권한이없습니다."
        res.render('board/inquiry/inquiryWrite', { permission, count_data })
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function inquiryDetail(req, res, next) {
    try {
        let token = req.session.user;
        let queryNum = req.query.num;
        let parameters = {
            "qid":queryNum,
            "name":'vistors'
        }
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const detailData = await inquiryBoardDAO.count_questionBoardDetail(parameters)
        const commentData = await inquiryBoardDAO.count_questionBoardComment(parameters)
        res.render('board/inquiry/inquiryDetail',{dayjs, permission, count_data, detailData, commentData})
    
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function inquiryComment(req, res, next) {
    try {
        let token = req.session.user;
        if(token == undefined) throw "Parameter ERR."
        let queryNum = req.query.num;
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss')
        let comment = req.body.comment;
        if(comment == "") throw "댓글을 입력하세요."
        let parameters = {
            "qid" : queryNum,
            "date" : datetime,
            "comment" : comment
        }
        const permission = await jwtmiddle.jwtCerti(token)
        parameters.userId = permission.userId
        parameters.userName = permission.userName
        const insert_inquiryComment = await inquiryBoardDAO.insert_inquiryComment(parameters)
        res.redirect(`/board/inquiry/inquiryDetail?num=${parameters.qid}`)
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function inquiryModify(req, res, next) {
    try {
        let token = req.session.user;
        let queryNum = req.query.num;
        let parameters = {
            "qid": queryNum,
            "name" : 'vistors'
        }

        if(token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        if(permission.userRole >= 5) throw "권한이없습니다."

        const detailData = await inquiryBoardDAO.count_questionBoardDetail(parameters)


        if(detailData[0].userId != permission.userId ) throw "권한이없습니다."

        res.render('board/inquiry/inquiryModify', {permission, count_data, detailData})
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function inquiryModifyPost(req, res, next) {
    try {
        let token = req.session.user;
        if(token == undefined) throw "Parameter ERR."
        let queryNum = req.query.num;
        if(req.body.title == "") throw "제목을 입력하세요."
        if(req.body.content == "") throw "내용을 입력하세요."
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss');
        const permission = await jwtmiddle.jwtCerti(token)

        let parameters = {
            "qid": queryNum,
            "title" :req.body.title,
            "content": req.body.content,
            "userId" :permission.userId,
            "date":datetime
        }
        const update_inquiry = await inquiryBoardDAO.update_inquiry(parameters)
        res.redirect('/board/inquiry?page=1')
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function inquiryWritePost(req, res, next) {
    try {
        let token = req.session.user;
        if(token == undefined) throw "Parameter ERR."
        let {title, content} = req.body;
        let file = req.file;
        if(title == "") throw "제목을 입력하세요."
        if(content == "") throw "내용을 입력하세요."
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss')
        const permission = await jwtmiddle.jwtCerti(token)
        let parameters = {
            "userId" : permission.userId,
            "userName" : permission.userName,
            "title" : title,
            "content" : content,
            "date" : datetime
        }
        if(file != undefined ) parameters.img = file.filename
        const insert_inquiry = await inquiryBoardDAO.insert_inquiry(parameters)
        res.redirect("/board/inquiry?page=1");
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

async function inquiryDelete(req, res, next){
    try {
        let token = req.session.user;
        let queryNum = req.query.num;
        if(token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        let parameters = {
            "qid": queryNum,
            "userId" : permission.userId
        }
        let delete_inquiry;
        if(permission.userRole == 0) delete_inquiry = await inquiryBoardDAO.delete_inquiry_admin(parameters)
        else delete_inquiry = await inquiryBoardDAO.delete_inquiry_user(parameters)
        res.redirect("/board/inquiry?page=1")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

module.exports = {
    inquiryMain,
    inquiryDetail,
    inquiryComment,
    inquiryWrite,
    inquiryWritePost,
    inquiryModify,
    inquiryModifyPost,
    inquiryDelete,
}