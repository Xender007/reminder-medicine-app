const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contactNumber: String,
    verified: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("Users", userSchema);