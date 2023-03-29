const orderModel = require('../../models/v1/order.model')

class OrderController {
    async addOrder(req , res , next){

        try {
           const customerID = req.body.customerID
           const totalPrice = req.body.totalPrice
           const shippingAddress = req.body.shippingAddress
           const products = req.body.products



          const newOrder = { customerID ,totalPrice,shippingAddress,products}

          console.log(newOrder)

          const order = new orderModel(newOrder)

          await order.save()

          res

            
        } catch (err) {
            
        }

    }

}


module.exports = new OrderController()