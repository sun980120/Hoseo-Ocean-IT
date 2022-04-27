'use strict';

var researcFieldsDAO = require('../model/researchFieldsDAO');
var boardDAO = require('../model/boardDAO');

function test(req, res, next) {
    var parameters={
        "type":"progress"
    };
    var db_values={};
    Promise.resolve(db_values)
    .then(
        (db_values)=>{
            return  researcFieldsDAO.researchFields_selectAll(parameters)
            .then((db_1) => {db_values.db_1 = db_1;})
            .then(()=> {return db_values})
        }
    )
    .then(
        (db_values)=>{
            return boardDAO.count_questionBoard(parameters)
            .then((db_2) => {db_values.db_2 = db_2;})
            .then(()=> {return db_values})
        }
    )
    .then(
        ()=>{
            console.log(db_values["db_2"])
            res.render('test', { db_1 : db_values["db_1"], db_2 : db_values["db_2"] })
        }
    )
    // researcFieldsDAO.researchFieldsFunc.researchFields_selectAll(parameters)
    // .then((db_1) => {db_values.db_1 = db_1;})
    // .then(()=>{
    //     return db_values.db_2 = boardDAO.boardDBFunc.count_questionBoard(parameters).then(
    //         (db_2) => { return db_2;}
    //     ).catch(err=>res.send("<script>alert('"+ err +"');</script>"))
    // })
    // .then( ()=>{
    //     console.log(db_values);res.render('test', { db_1 : db_values.db_1, db_2 : db_values.db_2 });})
    // .catch(err=>res.send("<script>alert('"+ err +"');</script>"))
}
module.exports = {
    test
}