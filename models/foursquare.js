'use strict';

var mongoose = require('mongoose');

var foursquareSchema = mongoose.Schema({
    _id:  String,
    lists: mongoose.Schema.Types.Mixed,
    expires: { 
        type: Date, 
        expires: '1d',
        default: Date.now,
        require: true
    }
});

var foursquare = mongoose.model('foursquare', foursquareSchema);