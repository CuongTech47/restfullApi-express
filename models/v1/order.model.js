const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  orderDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipping', 'delivered'], default: 'pending' },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit'], default: 'cash' },
  products: [{
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true }
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Orders', orderSchema);
