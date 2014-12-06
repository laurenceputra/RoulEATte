'use strict';


var UserModel = require('../models/user');


module.exports = function (router) {

    var model = new UserModel();


    router.get('/user/login', function (req, res) {
        
        res.render('index', model);
        
    });

    router.post('/user/login', function (req, res) {
        
        res.render('index', model);
        
    });

    router.get('/user/token', function (req, res) {
        
        res.render('index', model);
        
    });

    router.post('/user/token', function (req, res) {
        
        res.render('index', model);
        
    });

    router.get('/user/foursquare', function (req, res) {
        
        res.render('index', model);
        
    });

    router.post('/user/foursquare', function (req, res) {
        
        res.render('index', model);
        
    });

};
