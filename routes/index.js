// var express = require('express');
// var router = express.Router();

var productRouter = require('./v1/product.router')
const userRouter = require('./v1/user.router')
const authRouter = require('./v1/auth.router')
function router(app) {
  


// Register API versions 1
app.use('/api/v1/product', productRouter);

// app.use('/api/v1/user',userRouter)

app.use('/api/v1/auth',authRouter)


}

module.exports = router
