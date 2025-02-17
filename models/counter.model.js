const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    merchant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;