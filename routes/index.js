// var express = require('express');
// var router = express.Router();

var productRouter = require('./v1/product.route')
const userRouter = require('./v1/user.router')
const authRouter = require('./v1/auth.route')
function router(app) {
  


// Register API versions 1
app.use('/api/v1/products', productRouter);

// app.use('/api/v1/user',userRouter)

app.use('/api/v1/auth',authRouter)


}

module.exports = router
