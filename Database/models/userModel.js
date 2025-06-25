const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const User = mongoose.model("user", userSchema);

module.exports = User;