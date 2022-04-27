'use strict';

var express = require('express');
var router = express.Router();

var authController = require('../controller/authController');
var multer = require('./multer');

// sign up이부분도 수정
router.get('/sign/up', authController.signUp);
router.post('/sign/up', authController.signUpPost);

// sign in
router.get('/sign/in', authController.signIn);
router.post('/sign/in', authController.checkUser);

// update info (check)
router.get('/revise_check', authController.revise_check);
router.post('/revise_check', authController.revise_check_post);

// update info
router.post('/revise', multer.uploadUser.single('newFile'), authController.updateUser);

// logout
router.get('/logout', authController.logOut);

// sign up
// router.get('/sign/up', authController.authFunc.signUp);

// ---------------------------------------------------------------------------------------------------- //
// 안드로이드
// 로그인
router.post('/android/login',authController.androidLogin)
// 토큰 확인
router.post('/android/check', authController.checkToken)
// 회원정보 확인
router.post('/android/revise_check', authController.Apprevise_check_post);
// 회원정보 수정
router.post('/android/revise', authController.updateUserApp);

module.exports = router;