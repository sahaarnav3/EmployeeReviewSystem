const mongoose = require('mongoose');
const Employees = require('./employees');

const ratingSchema = mongoose.model({
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
    timestamps: true 
})

const Ratings = mongoose.Model('Ratings', ratingSchema);
module.exports = Ratings;