const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
let mongoUrl = process.env.MONGODB_URL
async function connect(){
    mongoose.connect(`${mongoUrl}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
}

module.exports = { connect }


