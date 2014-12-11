'use strict';


var mongoose = require('mongoose');
var request = require('request');
var utils = require('../util.js');

module.exports = function (router) {

    var User = mongoose.model('user');

    router.post('/',
        function (req, res) {
            res.render('user/login-token');
    });

    return router;

};
