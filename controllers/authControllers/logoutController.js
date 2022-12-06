const bcrypt = require('bcrypt');

// Models
const User = require('../../models/User');


const logoutUser = async (req, res, next) => {
    // On client side also, delete the 'accessToken'

    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.status(204).json({ message: 'No JWT (refreshToken) cookie was found!' });
    }
    const refreshToken = cookies.jwt;

    // If 'refreshToken' in DB
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        // If not in DB, just clear out the cookie sent by the client side
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
        res.sendStatus(204);
    }

    // Delete refreshToken from DB
    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', { path:'/', httpOnly: true, secure: true, sameSite: 'None' });
    res.json({ message: 'Logged out successfully!' });
};


module.exports = { logoutUser };