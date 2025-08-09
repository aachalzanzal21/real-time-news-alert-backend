const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
        categories: [String],
        frequency: {
            type: String,
            enum: ['immediate', 'hourly', 'daily'],
            default: 'daily'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
