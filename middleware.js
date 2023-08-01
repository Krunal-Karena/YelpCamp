const Campground = require('./models/campgrounds')
const Review = require("./models/review");
const ExpressError=require('./utils/ExpressError')
const {campgroundSchema, reviewSceham}=require('./schemas');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (!(['/login', '/register', '/', '/public/javascripts/validateForms.js', '/campgrounds'].includes(req.originalUrl))) {
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', 'you must be Sign in/Login first')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params
    const campgroundbyid=await Campground.findById({_id:id})
    if(!(campgroundbyid.author.equals(req.user._id))){
        req.flash('error',"You don't have permission to update campground")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(e=>e.message).join(',')
        throw new ExpressError(msg,404)
    }
    else{
        next();
    }
}

module.exports.validatReview=(req,res,next)=>{
    const {error}=reviewSceham.validate(req.body)
    if(error){
        const msg=error.details.map(e=>e.message).join(',')
        throw new ExpressError(msg,404)
    }
    else{
        next()
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params
    const reviewbyid=await Review.findById({_id:reviewId})
    if(!(reviewbyid.author.equals(req.user._id))){
        req.flash('error',"You don't have permission to delete review")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
