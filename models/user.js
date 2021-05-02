const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true},
    password: String,
    username: String,
    gender: { 
        type: String,
        enum: ['MALE', 'FEMALE']
    },
    phone: Number 
},
{ timestamps: true }
);

module.exports = mongoose.model('Subscriber', subscriberSchema)