const mongoose = require('mongoose');


let DriverSchemas = mongoose.Schema({

    name : {
        type : String,
        required : false 
    },
    email : {
        type : String,
        required : false,
        unique: true
    },
    
    password : {
        type : String,
        required : false 
    },
    
    mobile : {
        type : String,
        required : false ,
        unique: true
    }
});

module.exports = DriverSchemas = mongoose.model('drivers',DriverSchemas);