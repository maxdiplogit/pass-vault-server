const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'JWT accessToken missing from request headers' });
    }

    const accessToken = authHeader.split(' ')[1];
    console.log('AccessToken: ', accessToken);

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid JWT accessToken!' });
            }
            next();
        }
    );
};


module.exports = verifyJWT;