const bcrypt = require('bcrypt');

// Models
const User = require('../../models/User');

// Utilities
const ExpressError = require('../../utils/ExpressError');


const registerUser = async (req, res, next) => {
    const { username, password } = req.body;

    // Checking for duplicate users
    const duplicate = await User.findOne({ username }).exec();
    if (duplicate) {
        throw new ExpressError(409, 'User already exists');
    };
    
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    console.log(`New User Created: ${ newUser.username }`);
    res.status(201).json(newUser);
};


module.exports = { registerUser };