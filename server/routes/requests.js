const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST api/requests
// @desc    Create a new book request
// @access  Private (Student)
router.post('/', auth, requestController.createRequest);

// @route   GET api/requests
// @desc    Get all requests
// @access  Private/Admin
router.get('/', auth, admin, requestController.getAllRequests);

// @route   PUT api/requests/:id
// @desc    Update request status
// @access  Private/Admin
router.put('/:id', auth, admin, requestController.updateRequestStatus);

module.exports = router;
