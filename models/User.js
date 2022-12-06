const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const passwordsListSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String,
    passwordsList: [ passwordsListSchema ]
});


const User = mongoose.model('User', userSchema);


module.exports = User;