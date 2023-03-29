// var express = require('express');
// var router = express.Router();

const productRouter = require('./v1/product.route')
const userRouter = require('./v1/user.router')
const authRouter = require('./v1/auth.route')
const customerRouter = require('./v1/customer.route')
const orderRouter = require('./v1/order.route')
function router(app) {
  


// Register API versions 1
app.use('/api/v1/products', productRouter);

// app.use('/api/v1/user',userRouter)

app.use('/api/v1/auth',authRouter)

app.use('/api/v1/customers',customerRouter)

app.use('/api/v1/orders',orderRouter)

}

module.exports = router
