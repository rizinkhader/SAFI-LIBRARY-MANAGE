const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', bookController.getBooks);

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', bookController.getBookById);

// @route   POST api/books
// @desc    Add a book
// @access  Private/Admin
router.post('/', auth, admin, bookController.addBook);

// @route   PUT api/books/:id
// @desc    Update a book
// @access  Private/Admin
router.put('/:id', auth, admin, bookController.updateBook);

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete('/:id', auth, admin, bookController.deleteBook);

module.exports = router;
