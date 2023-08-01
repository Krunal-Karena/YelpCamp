const express = require('express')
const router = express.Router()
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {campgroundSchema, reviewSceham}=require('../schemas');
const Campground = require('../models/campgrounds');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')
const campgrounds=require('../controllers/campgrounds')
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground)) 

router.get('/new',isLoggedIn,catchAsync(campgrounds.renderNewForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,upload.array('image'),isAuthor,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editCampground))

module.exports=router;