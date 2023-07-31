const mongoose = require("mongoose");

//type: mongoose.Schema.Types.ObjectId, 

var medicineSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },    
    medicineName: String,
    dose: String,
    medicineType: {
        type: String
    },
    quantity: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);