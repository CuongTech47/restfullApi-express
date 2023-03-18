const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  emailVerified : {
    type : Boolean
  },
  phone: {
    type: String,
    default: null,
   
  },
  photoUrl: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: null,
   
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders',
   
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

module.exports = mongoose.model('Customers', customerSchema);

