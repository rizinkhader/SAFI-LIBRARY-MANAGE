const mongoose = require('mongoose');

const BookRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookDetails: {
        title: { type: String, required: true },
        author: { type: String, required: true },
        additionalInfo: { type: String }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('BookRequest', BookRequestSchema);
