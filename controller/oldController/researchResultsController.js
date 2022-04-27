'use strict';

var dayjs = require('dayjs');
var jwtmiddle = require('../middleware/jwt');
var researchResultsDAO = require('../model/researchResultsDAO');
var counterDAO = require('../model/counterDAO')

function researchResults(req, res, next) {
    var queryType = req.query.type;
    var queryPage = req.query.page;
    var parameters = {
        "type": queryType,
        "page": queryPage,
        "name": 'vistors'
    }
    researchResultsDAO.researchResults_selectAll(parameters).then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('research_results/researchResultsMain', { db_data, permission, parameters, dayjs, count_data });
                        }
                    ).catch(err => res.send("<script>alert('jwt err');</script>"));
                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}

function researchResultsDetail(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "rrid": queryNum,
        "name": 'vistors'
    };
    researchResultsDAO.researchResults_selectDetail(parameters).then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('research_results/researchResultsDetail', { db_data, permission, parameters, dayjs,count_data });
                        }
                    ).catch(err => res.send("<script>alert('jwt err');</script>"));
                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}

function androidResearchResultsAll(req, res, next) {
    var parameters = {
        "querys": req.query.classify
    };
    researchResultsDAO.researchResults_android_all(parameters).then(
        (db_data) => {
            res.json(db_data)
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
async function researcResultWrite(req, res, next){
    let token = req.session.user;
    var queryNum = req.query.num;
    var parameters = {
        "rrid": queryNum,
        "name": 'vistors'
    };
    try {
        const count_data = await counterDAO.findCount(parameters);
        const permission = await jwtmiddle.jwtCerti(token);
        return res.render('research_results/researchResultsWrite',{count_data, permission});
    } catch (error) {
        res.send("<scripte>alert('" + error + "');history.back();")
    }
}


module.exports = {
    researchResults,
    researchResultsDetail,
    androidResearchResultsAll,
    researcResultWrite,
}