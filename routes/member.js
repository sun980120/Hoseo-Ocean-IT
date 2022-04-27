'use strict';

var express = require('express');
var router = express.Router();
const db = require('../config/kyjdb');

var memberController = require('../controller/memberController');

//member
router.get('/', memberController.memberMain);

router.post('/android/memberALL', (req, res)=>{
    let token = req.get('token')
    db.query('select * from Member', (error, result)=>{
        if(error){
            throw error;
        }else{
            res.json({result});
        }
    })
})

module.exports = router;