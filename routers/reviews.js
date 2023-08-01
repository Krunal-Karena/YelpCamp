const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSceham}=require('../schemas');
const Campground = require('../models/campgrounds');
const Review = require("../models/review");
const {validatReview,isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')

router.post('/',isLoggedIn,validatReview,catchAsync(reviews.createReview))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports=router