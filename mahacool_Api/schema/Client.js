const mongoose = require('mongoose');

let ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bussinessName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true // This ensures that the email is unique
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String,
        required: false  // GST number is optional, hence not required
    },
    role: {
        type: String,
        default: 'client'  // Automatically sets the role to 'client'
    },
    customerID: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    notification: [
        
    ],
   fileUrls: [{
        url: String,
        date: Date
    }],
    location: [
        {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Client', ClientSchema);
