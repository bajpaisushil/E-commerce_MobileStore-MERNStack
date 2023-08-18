const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 200,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const User=mongoose.model('User', userSchema);
exports.User=User;
