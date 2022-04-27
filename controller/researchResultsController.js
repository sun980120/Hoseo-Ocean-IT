'use strict';

var dayjs = require('dayjs');
var jwtmiddle = require('../middleware/jwt');
var researchResultsDAO = require('../model/researchResultsDAO');
var counterDAO = require('../model/counterDAO')

async function researchResults(req, res, next) {
    let token = req.session.user;
    var queryType = req.query.type;
    var queryPage = req.query.page;
    var querySearch = req.query.schKeyword;
    var parameters = {
        "type": queryType,
        "page": queryPage,
        "search": querySearch,
        "name": 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        let db_data = []
        if (parameters.type == 'patent') {
            db_data += await researchResultsDAO.researchResults_selectPatent(parameters)
        } else if (parameters.type == 'treatise') {
            db_data += await researchResultsDAO.researchResults_selectTreatise(parameters)
        } else if (parameters.type == 'announcement') {
            db_data += await researchResultsDAO.researchResults_selectAnnouncement(parameters)
        }
        // const db_data = await researchResultsDAO.researchResults_selectAll(parameters);
        console.log(db_data[0])
        res.render('research_results/researchResultsMain', { db_data, permission, parameters, dayjs, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}

async function researchResultsDetail(req, res, next) {
    let token = req.session.user;
    var queryNum = req.query.num;
    var parameters = {
        "rrid": queryNum,
        "name": 'vistors'
    };
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await researchResultsDAO.researchResults_selectDetail(parameters);
        res.render('research_results/researchResultsDetail', { db_data, permission, parameters, dayjs, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function androidResearchResultsAll(req, res, next) {
    var parameters = {
        "querys": req.query.classify
    };
    try {
        const db_data = await researchResultsDAO.researchResults_android_all(parameters);
        res.json(db_data);
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researcResultWrite(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "rrid": queryNum,
        "name": 'vistors'
    };
    try {
        let queryToken = req.session.user;
        if (queryToken == undefined) throw "Parameter ERR."

        const count_data = await counterDAO.findCount(parameters);
        const permission = await jwtmiddle.jwtCerti(queryToken);
        if (permission.userRole >= 5) throw "권한이없습니다."

        if (permission.userRole < 5)
            return res.render('research_results/researchResultsWrite', { count_data, permission });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researcResultWriteP(req, res, next) {
    let body = req.body
    try {
        let queryToken = req.session.user;
        if (queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        let parameters = {
            "group_id": body.group,
            "date": body.date,
            "title_ko": body.title_ko,
            "writer_ko": body.writer_ko,
            "announe_nation_ko": body.announe_nation_ko,
            "classify_ko": body.classify_ko,
            "application_num": body.application_num
        }
        const searchResults = await researchResultsDAO.researchResults_check(parameters)
        if (searchResults[0] !== undefined) throw "이미 존재하는 과제명입니다.";
        const results = await researchResultsDAO.researchResults_insert(parameters)

        res.send("<script>alert('" + results + "');location.href='/research/results?type=all&schKeyword=&page=1';</script>")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}
async function researchResultDelete(req, res, next) {
    let rrid = req.query.num
    let parameters = {
        "rrid": rrid,
    }
    try {
        let queryToken = req.session.user;
        if (queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const delete_results = await researchResultsDAO.researchResults_delete(parameters)
        res.send("<script>alert('" + delete_results + "');location.href='/research/results?type=all&schKeyword=&page=1';</script>")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}

module.exports = {
    researchResults,
    researchResultsDetail,
    androidResearchResultsAll,
    researcResultWrite,
    researcResultWriteP,
    // researchResultDelete,

}