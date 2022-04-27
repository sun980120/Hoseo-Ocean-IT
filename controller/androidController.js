'use strict';

var androidDAO = require('../model/androidDAO');

//android
function Android(req, res, next) {
    var db_values = {};
    Promise.resolve(db_values)
        .then(
            (db_values) => {
                return androidDAO.androidDetail()
                    .then((detailData) => { db_values.detailData = detailData; })
                    .then(() => { return db_values })
                    .catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
            }
        )
        .then(
            (db_values) => {
                return androidDAO.androidPhoto(db_values["detailData"].rfid)
                    .then((photoData) => { db_values.photoData = photoData; })
                    .then(() => { return db_values })
                    .catch(err => res.send("<script>alert('" + err + "');location.href='/';</script>"))
            }
        )
        .then(
            () => {
                res.json(db_values)
            }
        )
        .catch(err => res.send("<script>alert('jwt err');</script>"));
}

module.exports = {
    Android
}