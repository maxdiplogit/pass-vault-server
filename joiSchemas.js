const Joi = require('joi');


const joiUserSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});


module.exports = { joiUserSchema };