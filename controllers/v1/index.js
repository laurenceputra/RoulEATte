'use strict';


var mongoose = require('mongoose');
var request = require('request');
var utils = require('../util.js');

module.exports = function (router) {

    var User = mongoose.model('user');

    router.post('/user/list/all',
        function (req, res) {
            res.render('user/login-token');
    });

    router.post('/user/list/:id',
        function (req, res) {
            res.render('user/login-token');
    });

    router.post('/location/near/:lng/:lat',
        function (req, res) {
            res.render('user/login-token');
    });

    router.post('/location/:id',
        function (req, res) {
            res.render('user/login-token');
    });

    return router;

};
