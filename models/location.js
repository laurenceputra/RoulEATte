'use strict';

var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    _id:  String,
    photo: {
        prefix: String,
        suffix: String
    },
    name: String,
    coords:[Number, Number], //lng, lat
    address: String,
    category: String,
    expires: {
        type: Date,
        default: Date.now,
        require: true,
        expires: '7d',
    }
});

locationSchema.index({
    coords: '2d',
    lists: 1
});

var location = mongoose.model('location', locationSchema);