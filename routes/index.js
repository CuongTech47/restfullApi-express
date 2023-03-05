// var express = require('express');
// var router = express.Router();

var productRouter = require('./v1/product.router')

function router(app) {
  


// Register API versions 1
app.use('/api/v1/product', productRouter);


}

module.exports = router
