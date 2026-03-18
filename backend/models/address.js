const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  name:String,
  phone:String,
  pincode:String,
  city:String,
  state:String,
  address:String

})

module.exports = mongoose.model("Address",addressSchema)