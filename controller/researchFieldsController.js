'use strict';

var dayjs = require('dayjs');
var jwtmiddle = require('../middleware/jwt');
var researchFieldsDAO = require('../model/researchFieldsDAO');
var counterDAO = require('../model/counterDAO')

async function researchFields(req, res, next) {
    var queryType = req.query.type;
    var queryPage = req.query.page;
    var querySearch = req.query.schKeyword;
    var parameters = {
        "type": queryType,
        "page": queryPage,
        "search": querySearch,
        "name": 'vistors',
    };
    let token = req.session.user;
    try {
        const count_data = await counterDAO.findCount(parameters);
        const permission = await jwtmiddle.jwtCerti(token);
        const db_data = await researchFieldsDAO.researchFields_selectAll(parameters);
        res.render('research_fields/researchFieldsMain', { db_data, permission, count_data, dayjs, parameters });
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}

async function researchFieldsDetail(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "rfid": queryNum,
        "name": 'vistors'
    };
    let token = req.session.user;
    try {
        const detailData = await researchFieldsDAO.researchFields_selectDetail(parameters);
        const linkData = await researchFieldsDAO.researchFields_selectDetailLinks(parameters);
        const photoData = await researchFieldsDAO.researchFields_selectDetailPhotos(parameters);
        const count_data = await counterDAO.findCount(parameters);
        const permission = await jwtmiddle.jwtCerti(token);
        console.log(detailData)
        res.render('research_fields/researchFieldsDetail', { dayjs, permission, detailData, linkData, photoData, count_data });
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}

async function androidResearchFieldsAll(req, res, next) {
    var querys = req.query.classify
    var sql = ""
    var parameters = {
        "querys": querys,
    };
    try {
        const db_data = await researchFieldsDAO.researchFields_android_all(parameters)
        console.log(db_data);
        res.json(db_data)
    } catch (error) {
        res.send("DBDRR", err)
    }
}

async function researchFieldsWrite(req, res, next) {
    var parameters = {
        "name": 'vistors'
    };
    try {
        const count_data = await counterDAO.findCount(parameters);

        let queryToken = req.session.user;
        if(queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."

        if (permission.userRole < 5)
            return res.render('research_fields/researchFieldsWrite', { count_data, permission });
        else throw "권한이없습니다.";
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}

async function researchFieldsWriteP(req, res, next) {
    let body = req.body
    let parameters = {
        classify_ko: body.classify_ko,
        research_name_ko: body.research_name_ko,
        business_name_ko: body.business_name_ko,
        department_name_ko: body.department_name_ko,
        subjectivity_agency_ko: body.subjectivity_agency_ko,
        support_agency_ko: body.support_agency_ko,
        participation_agency_ko: body.participation_agency_ko,
        research_goal_ko: body.research_goal_ko,
        research_content_ko: body.research_content_ko,
        expectation_result_ko: body.expectation_result_ko,
        research_manager_ko: body.research_manager_ko,
        research_belong_ko: body.research_belong_ko,
        date_start: body.date_start,
        date_end: body.date_end,
    }
    try {
        let queryToken = req.session.user;
        if(queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const searchFields = await researchFieldsDAO.researchFields_check(parameters);
        if (searchFields[0] !== undefined) throw "이미 존재하는 과제명입니다.";
        const results = await researchFieldsDAO.researchFields_insert(parameters);
        res.send("<script>alert('" + results + "');location.href='/research/fields?type=all&schKeyword=&page=1';</script>")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}
async function researchFieldsDelete(req, res, next){
    let rfid = req.query.num;
    let parameters = {
        "rfid":rfid,
    }
    console.log(parameters)
    try {
        let queryToken = req.session.user;
        if(queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const delete_fields_links = await researchFieldsDAO.researchFields_delete_links(parameters)
        const delete_fields_photos = await researchFieldsDAO.researchFields_delete_photos(parameters)
        const delete_fields = await researchFieldsDAO.researchFields_delete(parameters)
        res.send("<script>alert('" + delete_fields + "');location.href='/research/fields?type=all&schKeyword=&page=1';</script>")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}
async function researchFieldsModify(req, res, next){
    let rfid = req.query.num;
    var parameters = {
        "name": 'vistors',
        "rfid":rfid,
    };
    try {
        const count_data = await counterDAO.findCount(parameters);
        let queryToken = req.session.user;
        if(queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const detailData = await researchFieldsDAO.researchFields_selectDetail(parameters);
        console.log(detailData)
        if (permission.userRole < 5)
            return res.render('research_fields/researchFieldsModify', { count_data, permission, detailData });
        else throw "권한이없습니다.";
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function researchFieldsModifyP(req, res, next){
    let body = req.body
    let rfid = req.query.num;
    let parameters = {
        "rfid":rfid,
        classify_ko: body.classify_ko,
        research_name_ko: body.research_name_ko,
        business_name_ko: body.business_name_ko,
        department_name_ko: body.department_name_ko,
        subjectivity_agency_ko: body.subjectivity_agency_ko,
        support_agency_ko: body.support_agency_ko,
        participation_agency_ko: body.participation_agency_ko,
        research_goal_ko: body.research_goal_ko,
        research_content_ko: body.research_content_ko,
        expectation_result_ko: body.expectation_result_ko,
        research_manager_ko: body.research_manager_ko,
        research_belong_ko: body.research_belong_ko,
        date_start: body.date_start,
        date_end: body.date_end,
    }
    try {
        let queryToken = req.session.user;
        if(queryToken == undefined) throw "Parameter ERR."
        const permission = await jwtmiddle.jwtCerti(queryToken)
        if (permission.userRole >= 5) throw "권한이없습니다."
        const results = await researchFieldsDAO.researchFields_update(parameters);
        res.send("<script>alert('" + results + "');location.href='/research/fields?type=all&schKeyword=&page=1';</script>")
    } catch (error) {
        res.send("<script>alert('" + error + "');history.go(-1);</script>")
    }
}
module.exports = {
    researchFields,
    researchFieldsDetail,
    androidResearchFieldsAll,
    researchFieldsWrite,
    researchFieldsWriteP,
    researchFieldsDelete,
    researchFieldsModify,
    researchFieldsModifyP
}