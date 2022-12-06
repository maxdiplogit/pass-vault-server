const express = require('express');

// Router
const router = express.Router();

// Controllers
const registerController = require('../controllers/authControllers/registerController');
const loginController = require('../controllers/authControllers/loginController');
const logoutController = require('../controllers/authControllers/logoutController');
const refreshTokenController = require('../controllers/authControllers/refreshTokenController');

// Utilities
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Validation Schemas
const { joiUserSchema } = require('../joiSchemas');


// Joi Validation Middleware
const validateUser = (req, res, next) => {
    console.log('validateUser middleware: ', req.body);
    const { error } = joiUserSchema.validate(req.body);

    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, message);
    } else {
        next();
    }
};


// API Routes
router.route('/register')
    .post(validateUser, catchAsync(registerController.registerUser));

router.route('/login')
    .post(validateUser, catchAsync(loginController.loginUser));

router.route('/logout')
    .post(catchAsync(logoutController.logoutUser));

router.route('/refreshToken')
    .get(catchAsync(refreshTokenController.handleRefreshToken));


module.exports = router;