const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contactNumber: String,
    userType: {
        type: String,
        default: 'normal'
    },
    verified: {
        type: Boolean,
        default: false,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);