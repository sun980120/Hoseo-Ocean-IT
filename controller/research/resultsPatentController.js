'use strict';

var dayjs = require('dayjs');
var jwtmiddle = require('../../middleware/jwt');
var PatentDAO = require('../../model/researchResult/PatentDAO');
var counterDAO = require('../../model/counterDAO')

// Patent
async function researchResultsPatent(req, res, next) {
    let token = req.session.user;
    var queryPage = req.query.page;
    var querySearch = req.query.schKeyword;
    var parameters = {
        "type": 'patent',
        "page": queryPage,
        "search": querySearch,
        "name": 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await PatentDAO.researchResults_selectPatent(parameters)
        
        res.render('research_results/researchResultsMain', { db_data, permission, parameters, dayjs, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsPatentWrite(req, res, next) {
    try {
        let parameters = {
            "name": 'vistors'
        }
        let token = req.session.user;
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const count_data = await counterDAO.findCount(parameters);
        res.render('research_results/researchResultsWritePatent', { count_data, permission })
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsPatentDetail(req, res, next) {
    let token = req.session.user;
    var queryNum = req.query.num;
    var parameters = {
        "rrid": queryNum,
        "name": 'vistors'
    };
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await PatentDAO.researchResults_selectDetailPatent(parameters);
        res.render('research_results/researchResultsDetailPatent', { db_data, permission, parameters, dayjs, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsPatentDelete(req, res, next) {
    try {
        let token = req.session.user
        let queryNum = req.query.num;
        let parameters = {
            "rrid": queryNum,
        }
        if (token == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const db_data = await PatentDAO.researchResults_DeletePatent(parameters);
        res.redirect('/research/results/patent?schKeyword=&page=1');
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsPatentWriteP(req, res, next) {
    try {
        let parameters = {
            "group_id": req.body.group_id,
            "classify_ko": '특허',
            "title_ko": req.body.title_ko,
            "writer_ko": req.body.writer_ko,
            "announe_nation_ko": req.body.announe_nation_ko,
            "registration_num": req.body.registration_num,
            "registration_date": req.body.registration_date,
            "application_date": req.body.application_date,
            "application_num": req.body.application_num,
        }
        let token = req.session.user;
        if (token == undefined) throw "Parameter ERR."

        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."

        let insert_Patent = await PatentDAO.researchResults_InsertPatent(parameters)

        res.redirect('/research/results/patent?schKeyword=&page=1');

    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function researchResultsPatentModify(req, res, next) {
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
        const db_data = await PatentDAO.researchResults_selectDetailPatent(parameters);
        res.render('research_results/researchResultsModifyPatent', { db_data, count_data, permission })

    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchResultsPatentModifyP(req, res, next){
    try {
        let queryNum = req.query.num;
        console.log(req.body)
        let parameters = {
            "rrid": queryNum,
            "group_id": req.body.group_id,
            "classify_ko": '특허',
            "title_ko": req.body.title_ko,
            "writer_ko": req.body.writer_ko,
            "announe_nation_ko": req.body.announe_nation_ko,
            "registration_num": req.body.registration_num,
            "registration_date": req.body.registration_date,
            "application_date": req.body.application_date,
            "application_num": req.body.application_num,
        }
        let token = req.session.user;
        if (token == undefined) throw "Parameter ERR."

        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."

        let modify_Patent = await PatentDAO.researchResults_ModifyPatent(parameters)

        res.redirect('/research/results/patent?schKeyword=&page=1');

    } catch (error) {
        res.send("<script>alert('" + error + "');history.back();</script>")
    }
}
async function uploadImg(req, res, next) {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    researchResultsPatent,
    researchResultsPatentWrite,
    researchResultsPatentDetail,
    researchResultsPatentDelete,
    researchResultsPatentWriteP,
    researchResultsPatentModify,
    researchResultsPatentModifyP,
    uploadImg
}