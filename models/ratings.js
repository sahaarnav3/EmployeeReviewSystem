const mongoose = require('mongoose');
const Employees = require('./employees');

const ratingSchema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'complete'],
        required: true
    },
    content: {
        type: String
    }
}, {
    timestamp: true
});

const Ratings = mongoose.model('Ratings', ratingSchema);
module.exports = Ratings;