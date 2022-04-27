'use strict';

var jwtmiddle = require('../middleware/jwt');
var introductionDAO = require('../model/introductionDAO');
var counterDAO = require('../model/counterDAO')

function introductionMain(req, res, next) {
    var parameters = {
        "name": 'vistors'
    }
    introductionDAO.introduction_selectAll().then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('introduction/introductionMain', { db_data, permission,count_data });
                        }
                    ).catch(err => res.send("<script>alert('jwt err');location.href='/';</script>"));
                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}

module.exports = {
    introductionMain
}