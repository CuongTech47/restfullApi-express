const mongoose = require('mongoose');

const jwt = require("jsonwebtoken");
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



customerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('Customers', customerSchema);

