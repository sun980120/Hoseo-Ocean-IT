'use strict';

var dayjs = require('dayjs');
const db = require('../../config/kyjdb');
var jwtmiddle = require('../../middleware/jwt');
var freeBoardDAO = require('../../model/freeBoardDAO');
var counterDAO = require('../../model/counterDAO')

//free
async function freeBoardMain(req, res, next) {
    try {
        let token = req.session.user;
        let queryPage = req.query.page;
        let parameters = {
            "page": queryPage,
            "name" : 'vistors'
        }
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const db_data = await freeBoardDAO.count_freeBoard(parameters)
        console.log(db_data)
        res.render('board/free/FreeBoardMain', { db_data, permission, count_data,parameters })
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardWrite(req, res, next){
    try {
        let token = req.session.user;
        let parameters = {
            "name": 'vistors'
        }
        if(token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        if(permission.userRole >= 5) throw "권한이없습니다."
        res.render('board/free/FreeBoardWrite', { permission, count_data })
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardDetail(req, res, next){
    try {
        let token = req.session.user;
        let queryNum = req.query.num;
        let parameters = {
            "qid":queryNum,
            "name":'vistors'
        }
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const detailData = await freeBoardDAO.count_freeBoardDetail(parameters)
        const commentData = await freeBoardDAO.count_freeBoardComment(parameters)
        res.render('board/free/freeBoardDetail', {permission, count_data,detailData,commentData});
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardComment(req, res, next) {
    try {
        let token = req.session.user;
        if(token == undefined) throw "Parameter ERR."
        let queryNum = req.query.num;
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss')
        let comment = req.body.comment;
        if(comment == "") throw "댓글을 입력하세요."
        const permission = await jwtmiddle.jwtCerti(token)
        let parameters = {
            "qid" : queryNum,
            "date" : datetime,
            "comment" : comment,
            "userId" : permission.userId,
            "userName" : permission.userName
        }
        const insert_freeBoardComment = await freeBoardDAO.insert_freeBoardComment(parameters)
        res.redirect(`/board/free/freeBoardDetail?num=${parameters.qid}`)
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardModify(req, res, next) {
    try {
        let token = req.session.user;
        let queryNum = req.query.num;
        let parameters = {
            "qid":queryNum,
            "name":'vistors'
        }
        if(token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        if(permission.userRole >= 5) throw "권한이없습니다."

        const detailData = await freeBoardDAO.count_freeBoardDetail(parameters)

        if(detailData[0].userId != permission.userId) throw "권한이없습니다."
        res.render('board/free/freeBoardModify', {permission,detailData,count_data});
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardModifyPost(req, res, next) {
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
            "qid" : queryNum,
            "title": req.body.title,
            "content": req.body.content,
            "userId" : permission.userId,
            "date" : datetime
        }
        const update_freeBoard = await freeBoardDAO.update_freeBoard(parameters)
        res.redirect('/board/free?page=1')
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardWritePost(req, res, next) {
    try {
        let token = req.session.user;
        if(token == undefined) throw "Parameter ERR."
        let {title, content} = req.body;
        if(title == "") throw "제목을 입력하세요."
        if(content == "") throw "내용을 입력하세요."
        let date = new dayjs();
        let datetime = date.format('YYYY-MM-DD HH:mm:ss')
        const permission = await jwtmiddle.jwtCerti(token)
        let parameters = {
            "userId": permission.userId,
            "userName": permission.userName,
            "title": title,
            "content": content,
            "date": datetime
        }
        const insert_freeBoard = await freeBoardDAO.insert_freeBoard(parameters)
        res.redirect("/board/free?page=1");
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function freeBoardDelete(req, res, next) {
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
        let delete_freeBoard;
        if(permission.userRole == 0) delete_freeBoard = await freeBoardDAO.delete_freeBoard_admin(parameters)
        res.redirect("/board/free?page=1")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

module.exports = {
    freeBoardMain,
    freeBoardWrite,
    freeBoardDetail,
    freeBoardWritePost,
    freeBoardModify,
    freeBoardModifyPost,
    freeBoardDelete,
    freeBoardComment
}