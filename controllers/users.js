const User=require('../models/user')  
const passport=require('passport')
module.exports.rendeRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register =  async (req,res)=>{
    try{
    const {username,email,password}=req.body 
    const user = new User({username,email})
    const registeredUser = await User.register(user,password)
    req.login(registeredUser,(e)=>{
        if(e) return next(e)
        req.flash('success','Welcome to yelp camp!')
        res.redirect('/campgrounds')
    })
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}

module.exports.login = async(req,res)=>{
    req.flash('success','Welcome Back!!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout(
        (err)=>{
            if(err)
            console.log(err);
        }
    )
    req.flash('success','Succesfully logout')
    res.redirect('/')
}