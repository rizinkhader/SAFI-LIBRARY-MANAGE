const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

// Helper to calculate fine
const calculateFine = (dueDate) => {
    const today = new Date();
    const diffTime = Math.abs(today - new Date(dueDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (today > new Date(dueDate)) {
        return diffDays * 1; // 1 Rs per day
    }
    return 0;
};

exports.issueBook = async (req, res) => {
    const { studentId, bookId } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        if (book.availableCount < 1) return res.status(400).json({ msg: 'Book not available' });

        let user = await User.findById(studentId);
        // If not found by ID, maybe it's the custom string studentId
        if (!user) {
            user = await User.findOne({ studentId: studentId });
        }
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if user already has this book issued or reserved?
        // Let's skip that complexity for now for simplicity, or add basic check

        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(issueDate.getDate() + 7); // 7 days default

        const transaction = new Transaction({
            user: user._id,
            book: book.id,
            issueDate,
            dueDate,
            status: 'issued'
        });

        await transaction.save();

        // Update book availability
        book.availableCount -= 1;
        await book.save();

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.reserveBook = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        if (book.availableCount < 1) return res.status(400).json({ msg: 'Book not available' });

        // Basic check: prevent multi-reservation of same book
        const existing = await Transaction.findOne({ user: userId, book: bookId, status: { $in: ['issued', 'reserved'] } });
        if (existing) return res.status(400).json({ msg: 'You have already reserved or borrowed this book' });

        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(issueDate.getDate() + 2); // 2 days to pick up? Or just placeholder

        const transaction = new Transaction({
            user: userId,
            book: bookId,
            issueDate,
            dueDate,
            status: 'reserved'
        });

        await transaction.save();

        // Decrement availability? Yes, reservation holding.
        book.availableCount -= 1;
        await book.save();

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.returnBook = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId).populate('book');
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
        if (transaction.status === 'returned') return res.status(400).json({ msg: 'Book already returned' });

        transaction.returnDate = new Date();
        transaction.status = 'returned';

        // Calculate Fine
        const fine = calculateFine(transaction.dueDate);
        transaction.fine = fine;

        await transaction.save();

        // Update available count
        const book = await Book.findById(transaction.book._id);
        book.availableCount += 1;
        await book.save();

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.renewBook = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
        if (transaction.status === 'returned') return res.status(400).json({ msg: 'Book already returned' });

        // Add 7 days to current due date
        const currentDueDate = new Date(transaction.dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + 7);
        transaction.dueDate = currentDueDate;

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user', ['name', 'studentId']).populate('book', ['title']).sort({ issueDate: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).populate('book', ['title', 'author']).sort({ issueDate: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
