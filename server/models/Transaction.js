const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['issued', 'returned', 'overdue', 'reserved'],
        default: 'issued',
    },
    fine: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
