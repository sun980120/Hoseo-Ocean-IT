'use strict';

var jwtmiddle = require('../middleware/jwt');
var galleryDAO = require('../model/galleryDAO');
var counterDAO = require('../model/counterDAO')

async function galleryMain(req, res, next){
    let token = req.session.user;
    let parameters = {
        "name" : 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await galleryDAO.gallery_selectAll();
        res.render('gallery/galleryMain',{db_data, permission, count_data});
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function galleryDetail(req, res, next) {
    let token = req.session.user;
    let queryNum = req.query.num
    let parameters = {
        "gid" : queryNum,
        "name" : 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const db_data = await galleryDAO.gallery_selectOneDetail(parameters)
        res.render('gallery/galleryDetail', { db_data, permission, count_data })
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function galleryMainApp(req, res, next){
    let token = req.get('token')

    let parameters = {
        "name" : 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token);
        const count_data = await counterDAO.findCount(parameters);
        const db_data = await galleryDAO.gallery_selectAll();
        res.json({
            "count_data" :count_data,
            "permission" : permission,
            "db_data" : db_data
        })
    } catch (error) {
        res.status(403).json({"message" : error})
    }
}

async function galleryDetailApp(req, res, next) {
    let token = req.get('token')
    let queryNum = req.query.num
    let parameters = {
        "gid" : queryNum,
        "name" : 'vistors'
    }
    try {
        const permission = await jwtmiddle.jwtCerti(token)
        const count_data = await counterDAO.findCount(parameters)
        const db_data = await galleryDAO.gallery_selectOneDetail(parameters)
        res.json({
            "count_data" :count_data,
            "permission" : permission,
            "db_data" : db_data
        })
    } catch (error) {
        res.status(403).json({"message" : error})
    }
}
module.exports = {
    galleryMain,
    galleryDetail,
    galleryMainApp,
    galleryDetailApp,
}