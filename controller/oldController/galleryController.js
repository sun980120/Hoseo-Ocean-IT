'use strict';

var jwtmiddle = require('../middleware/jwt');
var galleryDAO = require('../model/galleryDAO');
var counterDAO = require('../model/counterDAO')

function galleryMain(req, res, next) {
    var parameters = {
        "name": 'vistors'
    }

    galleryDAO.gallery_selectAll().then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('gallery/galleryMain', { db_data, permission, count_data });
                        }
                    ).catch(err => res.send("<script>alert('jwt err');</script>"));
                }
            )
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}

function galleryDetail(req, res, next) {
    var queryNum = req.query.num;
    var parameters = {
        "gid": queryNum,
        "name": 'vistors'
    };

    galleryDAO.gallery_selectOneDetail(parameters).then(
        (db_data) => {
            counterDAO.findCount(parameters).then(
                (count_data) => {
                    let token = req.session.user;
                    jwtmiddle.jwtCerti(token).then(
                        (permission) => {
                            res.render('gallery/galleryDetail', { db_data, permission,count_data });
                        }
                    ).catch(err => res.send("<script>alert('jwt err');</script>"));
                }
            ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
        }
    ).catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
}
module.exports = {
    galleryMain,
    galleryDetail
}