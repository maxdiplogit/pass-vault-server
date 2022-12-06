const jwt = require('jsonwebtoken');

//Models
const User = require('../../models/User');


const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    console.log(cookies);

    if (!cookies.jwt) {
        return res.status(401).json({ message: 'No JWT refreshToken found in cookies!' });
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    console.log('Found User: ', foundUser);

    if (!foundUser) {
        // Forbidden
        return res.sendStatus(403);
    }

    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                // Forbidden
                return res.sendStatus(403);
            }

            const newAccessToken = jwt.sign(
                { username: decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );

            res.json({ newAccessToken });
        }
    );
};


module.exports = { handleRefreshToken };