'use strict';

var jwtmiddle = require('../middleware/jwt');
var memberDAO = require('../model/memberDAO');
var counterDAO = require('../model/counterDAO')

function memberMain(req, res, next) {
    var parameters = {
        "name": 'vistors'
    }
    var db_data;
    memberDAO.Member_selectAll()
    .then((recv_data) => { db_data = recv_data; })
    .then(
        ()=>{
    counterDAO.findCount(parameters).then(
        (count_data) => {
            let token = req.session.user;
            jwtmiddle.jwtCerti(token).then(
                (permission)=>{
                    res.render('member/memberMain', { db_data, permission,count_data });
                }
            ).catch(err=>res.send("<script>alert('jwt err');</script>"));
        })
    })
    .catch(err=>res.send("<script>alert('"+ err +"');location.href='/';</script>"))
}

module.exports = {
    memberMain
}