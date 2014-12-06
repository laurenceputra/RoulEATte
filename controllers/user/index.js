'use strict';


var UserModel = require('../../models/user');


module.exports = function (router) {

    var model = new UserModel();


    router.get('/login', function (req, res) {
        
        res.render('index', model);
        
    });

    router.post('/login', function (req, res) {
        
        res.render('index', model);
        
    });

    router.get('/token', function (req, res) {
        
        res.render('index', model);
        
    });

    router.post('/token', function (req, res) {
        
        res.render('index', model);
        
    });

    router.get('/foursquare', function (req, res) {
        
        res.render('index', model);
        
    });

    router.post('/foursquare', function (req, res) {
        
        res.render('index', model);
        
    });

    return router;

};
