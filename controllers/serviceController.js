// Models
const User = require('../models/User');

// Utilities
const ExpressError = require('../utils/ExpressError');


// Controllers
module.exports.createService = async (req, res, next) => {
    const { userId } = req.params;
    const { service, password } = req.body;
    console.log(userId);
    console.log(service, password);
    const foundUser = await User.findById(userId);
    const newService = { service, password };
    foundUser.passwordsList.push(newService);
    await foundUser.save();
    res.json({ foundUser });
};