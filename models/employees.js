const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        required: true
    }
}, {
    timestamp: true
});

const Employees = mongoose.model('Employees', employeeSchema);
module.exports = Employees;