if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require("express");
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ExpressError=require('./utils/ExpressError');
const userroutes=require('./routers/users')
const campgroundroutes=require('./routers/campgrounds')
const reviewrouters=require('./routers/reviews')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const localStrategy=require('passport-local')
const User=require('./models/user');
const mongoSanitize=require("express-mongo-sanitize")
const helmet=require("helmet")

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", { 
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,'connection error : '));
db.once('open' , () => {
    console.log('Database Connected');
})
 
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig={
    name:"Kk",
    secret:'thisisasimplesecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com/",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwkcymxvv/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://unpkg.com",
                "https://tile.openstreetmap.org/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',userroutes)
app.use('/campgrounds',campgroundroutes)
app.use('/campgrounds/:id/reviews',reviewrouters)
app.use(mongoSanitize())

app.get('/',(req,res) => {
    res.render('home');
});


app.all('*',(req,res,next)=>{
    next(new ExpressError("Page not found",404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 404,message = 'Something went wrong'} = err;
    res.status(statusCode).render('error',{err});
})

app.listen(3000,function(){
    console.log("Server strated on port 3000");
})