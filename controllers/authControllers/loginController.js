const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('../../models/User');

// Utilities
const ExpressError = require('../../utils/ExpressError');


const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username }).exec();
    
    // If user doesn't exist
    if (!foundUser) {
        // Unauthorized 401
        throw new ExpressError(401, `${ username } doesn't exist in the database`);
    }

    const match = await bcrypt.compare(password, foundUser.password);

    // If the passwords match
    if (match) {
        
        // Generate access token for user
        const accessToken = jwt.sign({
            userInfo: {
                username
            }
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' });

        // Generate refresh token for user
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving 'refreshToken' with current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // Creates Secure Cookie with 'refreshToken'
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send access token back to the logged in client
        res.json({ _id: foundUser._id, username: foundUser.username, passwordsList: foundUser.passwordsList, accessToken });
    }
};


module.exports = { loginUser };