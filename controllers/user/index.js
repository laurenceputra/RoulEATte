'use strict';


var mongoose = require('mongoose');
var passwordless = require('passwordless');
var utils = require('../util.js');

module.exports = function (router) {

    var User = mongoose.model('user');

    router.get('/login', function (req, res) {
        
        res.render('user/login');
        
    });

    router.post('/login', 
        passwordless.requestToken(function(user, delivery, callback) {
                callback(null,'asdasda');
            }, 
            { failureRedirect: '/user/login', userField:'email' }
        ),
        function (req, res) {
        
        res.redirect('/user/token');
        
    });

    router.get('/token', function (req, res) {
        
        res.render('user/login-token');
        
    });

    router.post('/token', 
        passwordless.acceptToken({allowPost: true, successRedirect:'/user/foursquare'}), 
        function (req, res) {
            res.render('user/login-token');
    });

    router.get('/foursquare', utils.noLoggedIn, function (req, res) {
        var foursquare = require('../../config/foursquare.js')();
        var data = {};
        data.foursquare = foursquare;
        res.render('user/login-foursquare', data);
    });

    router.get('/foursquare_redirect', function (req, res) {
        var foursquare = require('../../config/foursquare.js')();
        function userDetailsCallback(err, response, body, token){
            if(err){
                res.redirect('/user/foursquare');
                console.log(err);
                return;
            }
            var foursquareUser = JSON.parse(body);
            if(foursquareUser.meta.code !== 200){
                console.log('Error, return code not 200. ' + foursquareUser.toString());
            }
            foursquareUser = foursquareUser.response;
            var options = {_id: foursquareUser.user.id};
            User.findOne(options, function(err, user){
                if(err){
                    res.redirect('/user/foursquare');
                    console.log(err);
                    return;
                }
                if(!user){
                    user = new User();

                    user._id = foursquareUser.user.id;
                    user.name = foursquareUser.user.name;
                    user.photo = foursquareUser.user.photo.prefix + '200x200' + foursquareUser.user.photo.suffix;
                    user.email = foursquareUser.user.contact.email;
                    user.foursquare_token = token;
                    user.save(function(err, user){
                        if(err){
                            console.log(err);
                            res.redirect('/user/foursquare');
                            return;
                        }
                    });
                }
                req.session.user_id = user._id;
                req.session.foursquare_token = user.foursquare_token;
                res.redirect('/');
            });
        }

        function accessTokenCallback(err, response, body){
            if(err){
                res.redirect('/user/foursquare');
                console.log(err);
                return;
            }
            try{
                var token = JSON.parse(body);
                if(!token.access_token){
                    throw 'Error, access token not found. ' + token.toString();
                }
                
                foursquare.getUserDetails(token.access_token, userDetailsCallback);
            }
            catch(err){
                console.log(err);
                res.redirect('/user/foursquare');
                return;
            }
        }

        foursquare.getAccessToken(req.query.code, accessTokenCallback);
    });

    router.get('/logout', utils.requireLogIn, function (req, res) {
        req.session.destroy();
        res.redirect('/');
    });

    return router;

};
