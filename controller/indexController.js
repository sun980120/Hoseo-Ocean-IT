'use strict';

var jwtmiddle = require('../middleware/jwt');
var memberDAO = require('../model/memberDAO');
var researchFieldsDAO = require('../model/researchFieldsDAO');
var researchResultsDAO = require('../model/researchResultsDAO');
var boardDAO = require('../model/noticeBoardDAO');
var counterDAO = require('../model/counterDAO')

var fs = require('fs');
var path = require('path');
var mime = require('mime')

function indexMain(req, res, next) {
  let token = req.session.user;
  jwtmiddle.jwtCerti(token).then(
    (permission) => {
       res.render('index', { permission });
    }
  )
}
async function indexMainApp(req, res, next){
  let token = req.get('token')
  try {
    const permission = await jwtmiddle.jwtCerti(token)
    const fields_data = await researchFieldsDAO.researchFields_MainApp()
    const results_data = await researchResultsDAO.researchResults_MainApp()
    const notice_data = await boardDAO.count_noticeBoardApp()
    res.json({
      "permission": permission,
      "notice_data": notice_data,
      "fields_data": fields_data,
      "results_data": results_data
    })
  } catch (error) {
    res.status(403).json({"message" : error})
  } 
}
async function indexDownloadApp(req, res, next){
  const file = __dirname + '/../public/downloads/Ocean_IT.apk';
  const filename = path.basename(file);
  const mimetype = mime.getType(file)

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  const filestream = fs.createReadStream(file);
  filestream.pipe(res);
}

module.exports = {
  indexMain,
  indexMainApp,
  indexDownloadApp
}