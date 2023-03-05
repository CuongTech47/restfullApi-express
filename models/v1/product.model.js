const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, require: true },
  quantity: { type: Number, required: true },
  
},
  { timestamps: true}
);
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Products", productSchema);
