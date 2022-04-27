'use strict';

var dayjs = require('dayjs');
var jwtmiddle = require('../../middleware/jwt');
var AnnouncementDAO = require('../../model/researchResult/AnnouncementDAO');
var counterDAO = require('../../model/counterDAO')

// Announcement
async function researchResultsAnnouncement(req, res, next) {
    let token = req.session.user;
    var queryPage = req.query.page;
    var querySearch = req.query.schKeyword;
    var parameters = {
        "type": 'announcement',
        "page": queryPage,
        "search": querySearch,
        "name": 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await AnnouncementDAO.researchResults_selectAnnouncement(parameters)
        res.render('research_results/researchResultsMain', { db_data, permission, parameters, dayjs, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsAnnouncementWrite(req, res, next) {
    try {
        let parameters = {
            "name": 'vistors'
        }
        let token = req.session.user;
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const count_data = await counterDAO.findCount(parameters);
        res.render('research_results/researchResultsWriteAnnouncement',{count_data,permission})
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsAnnouncementDetail(req, res, next) {
    let token = req.session.user;
    var queryNum = req.query.num;
    var parameters = {
        "rrid": queryNum,
        "name": 'vistors'
    };
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await AnnouncementDAO.researchResults_selectDetailAnnouncement(parameters);
        res.render('research_results/researchResultsDetailAnnouncement', { db_data, permission, parameters, dayjs, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsAnnouncementDelete(req, res, next){
    try {
        let token = req.session.user
        let queryNum = req.query.num;
        let parameters = {
            "rrid": queryNum,
        }
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const db_data = await AnnouncementDAO.researchResults_DeleteAnnouncement(parameters);
        res.redirect('/research/results/announcement?schKeyword=&page=1');
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsAnnouncementWriteP(req,res,next){
    try {
        let parameters = {
            "announe_nation_ko":req.body.announe_nation_ko,
            "classify_ko" : "발표",
            "title_ko": req.body.title_ko,
            "writer_ko": req.body.writer_ko,
            "application_date": req.body.application_date,
            "academic_ko":req.body.academic_ko,
        }
        let token = req.session.user;
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        let insert_Announcement = AnnouncementDAO.researchResults_InsertAnnouncement(parameters)
        res.redirect('/research/results/announcement?schKeyword=&page=1');
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function researchResultsAnnouncementModify(req, res, next) {
    try {
        let token = req.session.user
        let queryNum = req.query.num;
        let parameters = {
            "rrid": queryNum,
            "name": 'vistors'
        }
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await AnnouncementDAO.researchResults_selectDetailAnnouncement(parameters);
        res.render('research_results/researchResultsModifyAnnouncement', { db_data, count_data, permission })
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsAnnouncementModifyP(req, res, next){
    try {
        let queryNum = req.query.num;
        let parameters = {
            "rrid": queryNum,
            "announe_nation_ko":req.body.announe_nation_ko,
            "classify_ko" : "발표",
            "title_ko": req.body.title_ko,
            "writer_ko": req.body.writer_ko,
            "application_date": req.body.application_date,
            "academic_ko":req.body.academic_ko,
        }
        let token = req.session.user;
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        let modify_Announcement = await AnnouncementDAO.researchResults_ModifyAnnouncement(parameters)
        res.redirect('/research/results/announcement?schKeyword=&page=1');
    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}

module.exports = {
    researchResultsAnnouncement,
    researchResultsAnnouncementWrite,
    researchResultsAnnouncementDetail,
    researchResultsAnnouncementDelete,
    researchResultsAnnouncementWriteP,
    researchResultsAnnouncementModify,
    researchResultsAnnouncementModifyP
}