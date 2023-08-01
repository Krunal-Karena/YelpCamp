const Campground = require('../models/campgrounds');
const cloudinary = require('cloudinary').v2;
const NodeGeocoder = require('node-geocoder');
const GeoJSON = require('geojson');

const geocoder = NodeGeocoder({provider: 'openstreetmap'});

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = async(req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req,res,next)=>{
    const geoData = await geocoder.geocode(req.body.campground.location);
    const {geometry}=GeoJSON.parse(geoData[0], {Point: ['longitude','latitude']});
    const campground = new Campground(req.body.campground)
    campground.geometry=geometry
    campground.images = req.files.map(f => ({url : f.path,filename : f.filename}));
    campground.author=req.user._id
    await campground.save()
    // console.log(campground);
    req.flash('success','Successfully Added New campground!!!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async (req,res)=> {
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
        }).populate('author')
    if(!campground){
        req.flash('error',"Can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
}

module.exports.editCampground=async (req,res)=>{ 
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}

module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params
    const campground =await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f => ({url : f.path,filename : f.filename}));
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }

        await Campground.updateOne({$pull:{images:{filename:{$in : req.body.deleteImages}}}})
        console.log(campground);
    }
    req.flash('success','Successfully updated campground!!!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Succesfully deleted campground')
    res.redirect('/campgrounds')
}