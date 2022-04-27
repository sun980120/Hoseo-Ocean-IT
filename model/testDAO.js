var db = require("../config/kyjDB");
var logger = require('../config/logger');
// function selectAll(req, res, next) {
//     db.query(`SELECT * FROM test`, function (error, db_data) {
//         if (error) {
//             throw error;
//         }
//         console.log("rows : " + JSON.stringify(db_data));

//         req.db_result = db_data;
//         next();
//     });
// }

module.exports.getDBFunction = {
    selectAll : function(req, res, next, a){
        db.query(`SELECT * FROM test where tid=${a}`, function (error, db_data) {
            if (error) {
                throw error;
            }
            console.log(a);
            console.log("rows : " + JSON.stringify(db_data));
            
            req.db_result = db_data;
            next();
        });
    }
}