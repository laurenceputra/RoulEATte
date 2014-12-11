'use strict';

var mongoose = require('mongoose');

var foursquareSchema = mongoose.Schema({
    id: String,
    lists: mongoose.Schema.Types.Mixed,
    expires: { 
        type: Date, 
        index: { expires: '1d' },
        default: Date.now,
        require: true
    }
});

var foursquare = mongoose.model('foursquare', foursquareSchema);