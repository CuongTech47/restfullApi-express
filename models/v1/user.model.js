const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true ,unique:true,lowercase:true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  
},
{ timestamps: true}
);

module.exports = mongoose.model("Users", userSchema);
