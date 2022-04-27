'use strict';
var express = require('express');
var randomstring = require('randomstring');
var router = express.Router();
var noticeController = require('../controller/board/noticeController')
var inqquiryController = require('../controller/board/inquiryController')
var freeController = require('../controller/board/freeController')

var multer = require('./multer')

//공지사항 게시판
router.get('/notice', noticeController.noticeMain);
router.get('/app-notice', noticeController.noticeMainApp);
router.get('/notice/noticeWrite', noticeController.noticeWrite);
router.get('/notice/noticeDetail', noticeController.noticeDetail);
router.get('/notice/noticeModify', noticeController.noticeModify);
router.post('/notice/noticeModify', noticeController.noticeModifyPost);
router.post('/notice/noticeWrite', noticeController.noticeWritePost);
router.post('/notice/delete', noticeController.noticeDelete);

//문의게시판(1:1)
router.get('/inquiry', inqquiryController.inquiryMain);
router.get('/inquiry/inquiryWrite', inqquiryController.inquiryWrite);
router.get('/inquiry/inquiryDetail', inqquiryController.inquiryDetail);
router.get('/inquiry/inquiryModify', inqquiryController.inquiryModify);
router.post('/inquiry/inquiryModify', inqquiryController.inquiryModifyPost);
router.post('/inquiry/inquiryWrite', multer.uploadBoard.single('newFile'), inqquiryController.inquiryWritePost);
router.post('/inquiry/delete', inqquiryController.inquiryDelete);
router.post('/inquiry/inquiryComment', inqquiryController.inquiryComment);

// 자유게시판
router.get('/free', freeController.freeBoardMain);
router.get('/free/freeBoardWrite', freeController.freeBoardWrite);
router.get('/free/freeBoardDetail', freeController.freeBoardDetail);
router.get('/free/freeBoardModify', freeController.freeBoardModify);
router.post('/free/freeBoardModify', freeController.freeBoardModifyPost);
router.post('/free/freeBoardWrite', freeController.freeBoardWritePost);
router.post('/free/delete', freeController.freeBoardDelete);
router.post('/free/freeBoardComment', freeController.freeBoardComment);

module.exports = router;
