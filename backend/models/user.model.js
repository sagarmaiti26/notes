const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fullName:String,
    email:String,
    password:String,
    createdOn:{type:Date,default:new Date().getTime()}
});
module.exports=mongoose.model("User",userSchema);