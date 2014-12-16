'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: String,
    name: String,
    photo: String,
    email: String,
    foursquare_token: String,
});

var user = mongoose.model('user', userSchema);