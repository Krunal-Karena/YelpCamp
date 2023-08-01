const cities = require('./cities');
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const {descriptors,places} = require('./seedHelpers');

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", { 
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,'connection error : '));
db.once('open' , () => {
    console.log('Database Connected');
})

const sample = (array)=>array[Math.floor(Math.random()*array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
        const rand1000=Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'64bd6aecdaaf871a06b97ef3',
            location:`${cities[rand1000].city} , ${cities[rand1000].state}`,
            geometry: { type: 'Point', coordinates: [ cities[rand1000].latitude, cities[rand1000].longitude ] },
            title:`${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dwkcymxvv/image/upload/v1690316115/YelpCamp/sdykoxjpbi3hpz4m6rsf.jpg',
                  filename: 'YelpCamp/sdykoxjpbi3hpz4m6rsf',
                },
                {
                  url: 'https://res.cloudinary.com/dwkcymxvv/image/upload/v1690316115/YelpCamp/ubcn0a1h39bqbglpl7lg.jpg',
                  filename: 'YelpCamp/ubcn0a1h39bqbglpl7lg',
                },
                {
                  url: 'https://res.cloudinary.com/dwkcymxvv/image/upload/v1690316115/YelpCamp/v6y1k96hwqgdv2adign8.jpg',
                  filename: 'YelpCamp/v6y1k96hwqgdv2adign8',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})