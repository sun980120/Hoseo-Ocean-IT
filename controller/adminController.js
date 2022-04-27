'use strict';

var jwtmiddle = require('../middleware/jwt');
var counterDAO = require('../model/counterDAO')
const adminDAO = require('../model/adminDAO')

// function adminMain(req, res, next) {
//     var queryType = req.query.type;
//     var queryPage = req.query.page;
//     var parameters = {
//         "type": queryType,
//         "page": queryPage,
//         "name": 'vistors'
//     }
//     var db_values = {};
//     Promise.resolve(db_values)
//         .then(
//             (db_values) => {
//                 return boardDAO.count_questionBoard()
//                     .then((recv_data) => { db_values.recv_data = recv_data; })
//                     .then(() => { return db_values })
//             }
//         )
//         .then(
//             (db_values) => {
//                 return counterDAO.findCount(parameters)
//                     .then((countData) => { db_values.countData = countData; })
//                     .then(() => { return db_values })
//             }
//         )
//         .then(
//             () => {
//                 let token = req.session.user;
//                 jwtmiddle.jwtCerti(token).then(
//                     (permission) => {
//                         res.render('admin/adminMain', {
//                             countData: db_values["countData"],
//                             recv_data: db_values["recv_data"],
//                             db_values,
//                             permission
//                         });
//                     }
//                 ).catch(err => res.send("<script>alert('jwt err');</script>"));
//             }
//         ).catch(err => res.send("<script>alert('" + err + "');location.href='/'"))
// }

async function adminMain(req, res, next) {
    let token = req.session.user;
    let parameters = {
        "name": 'vistors'
    }
    try {
        if (token == undefined) throw "사용자 정보가 없습니다."
        const permission = await jwtmiddle.jwtCerti(token);

        if (permission.userRole != 0) throw "권한이없습니다"

        parameters.role = permission.userRole
        const count_data = await counterDAO.findCount(parameters);
        const admin_list = await adminDAO.admin_list(parameters);

        res.render('admin/adminMain', { count_data, permission, admin_list });

    } catch (error) {

        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}
async function adminMainP(req, res, next) {
    let token = req.session.user;

    let parameters = {
        "userId": req.body.userId
    }
    try {
        if (token == undefined) throw "사용자 정보가 없습니다."
        const permission = await jwtmiddle.jwtCerti(token)
        if (permission.userRole >= 5) throw "권한이없습니다."

        // parameters.role = permission.userRole;
        const admin_update = await adminDAO.admin_update(parameters)

        res.redirect("/admin")
    } catch (error) {
        res.send("<script>alert('" + error + "');location.href='/';</script>")
    }
}

module.exports = {
    adminMain,
    adminMainP,
}