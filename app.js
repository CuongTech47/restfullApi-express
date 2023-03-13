const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const db = require('./config/db');
const cors = require('cors')
const dotenv = require('dotenv')

const errorHandler = require('./middleware/v1/error')

const indexRouter = require('./routes/index');

const fileUpload = require('express-fileupload')


var app = express();
app.use(cors())
dotenv.config()
db.connect()

// Setup middleware to set response header to application/json
// app.use(function(req, res, next) {
//     res.header("Content-Type", "application/json");
//     next();
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//file uploading
app.use(fileUpload())

indexRouter(app)


app.use(errorHandler)

// app.use((error , req ,res , next)=>{
//     console.log(error)
//     const status = error.statusCode || 500
//     const message = error.message
//     res.status(status).json({
//         message : message
//     })
// })


module.exports = app;
