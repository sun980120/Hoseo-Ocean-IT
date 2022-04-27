'use strict';

var express = require('express');
var router = express.Router();

var galleryController = require('../controller/galleryController');

//gallery
router.get('/', galleryController.galleryMain);

//gallery detail
router.get('/detail', galleryController.galleryDetail);

// App Gallery
router.get('/app', galleryController.galleryMainApp);

// App Gallery Detail
router.get('/app/detail', galleryController.galleryDetailApp);

module.exports = router;