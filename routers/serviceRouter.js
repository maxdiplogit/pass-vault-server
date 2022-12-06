const express = require('express');

// Router
const router = express.Router();

// Controllers
const serviceController = require('../controllers/serviceController');

// Utilities
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Middlewares
const verifyJWT = require('../middlewares/verifyJWT');


// API Routes
router.route('/:userId')
    .post(verifyJWT, catchAsync(serviceController.createService));


module.exports = router;