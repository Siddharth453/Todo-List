const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
//SCHEMA SETUP
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema)