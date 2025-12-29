const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/transactions/issue
// @desc    Issue a book
// @access  Private/Admin
router.post('/issue', auth, admin, transactionController.issueBook);

// @route   POST api/transactions/return
// @desc    Return a book
// @access  Private/Admin
router.post('/return', auth, admin, transactionController.returnBook);

// @route   POST api/transactions/reserve
// @desc    Reserve a book
// @access  Private (Student)
router.post('/reserve', auth, transactionController.reserveBook);

// @route   POST api/transactions/renew
// @desc    Renew a book
// @access  Private (Student/Admin)
router.post('/renew', auth, transactionController.renewBook);

// @route   GET api/transactions
// @desc    Get all transactions
// @access  Private/Admin
router.get('/', auth, admin, transactionController.getAllTransactions);

// @route   GET api/transactions/me
// @desc    Get my transactions
// @access  Private
router.get('/me', auth, transactionController.getMyTransactions);

module.exports = router;
