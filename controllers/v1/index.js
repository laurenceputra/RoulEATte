'use strict';


var mongoose = require('mongoose');
var request = require('request');
var utils = require('../util.js');

module.exports = function (router) {

    var User = mongoose.model('user');
    var Foursquare = mongoose.model('foursquare');
    var Locations = mongoose.model('location');

    var foursquareConfig = require('../../config/foursquare.js')();

    function unauthorizedAccess(res){
        res.json({'status': 'failed', 'msg': 'Not logged in', 'url':'/user/foursquare'});
    }

    function failure(res, msg, url){
        console.log(msg);
        res.json({'status': 'failed', 'msg': msg, 'url': url});
    }

    function success(res, data){
        res.json({'status': 'success', 'data': data});
    }
    router.get('/user/list/all',
        function (req, res) {
            if(utils.isLoggedIn(req)){
                Foursquare.findOne(utils.isLoggedIn(req), function(err, foursquare){
                    if(err){
                        failure(res, err, null);
                        return;
                    }
                    if(!foursquare){
                        failure(res, 'Data not found', '/');
                        return;
                    }
                    var lists = [];
                    var foursquareListKeys = Object.keys(foursquare.lists);
                    for (var i = 0; i < foursquareListKeys.length; i++) {
                        lists.push({
                            'id': foursquareListKeys[i],
                            'name': foursquare.lists[foursquareListKeys[i]].name
                        });
                    }
                    success(res, lists);
                });
            }
            else{
                unauthorizedAccess(res);
            }
    });

    router.get('/user/list/:id',
        function (req, res) {
            if(utils.isLoggedIn(req)){
                Foursquare.findOne(utils.isLoggedIn(req), function(err, foursquare){
                    if(err){
                        failure(res, err, null);
                        return;
                    }
                    if(!foursquare){
                        failure(res, 'Data not found', '/');
                        return;
                    }
                    if(foursquare.lists[decodeURIComponent(req.params.id)]){
                        var data = {
                            id: decodeURIComponent(req.params.id),
                            list: foursquare.lists[decodeURIComponent(req.params.id)].list
                        };
                        success(res, data);
                    }
                    else{
                        failure(res, 'Data not found', '/');
                    }
                    
                });
            }
            else{
                unauthorizedAccess(res);
            }
    });

    function getLocationCallback(res, backup, err, response, body){
        if(err){
            res.json(backup);
            console.log(err);
            return;
        }
        try{
            var locations = JSON.parse(body);
            locations = locations.response.groups[0].items;
            var locationList = [];
            locations.forEach(function(location){
                var newLocation = foursquareConfig.morphLocation(location);
                var id = newLocation._id;
                delete newLocation._id;
                newLocation.expires = Date.now();
                Locations.update({_id: id}, newLocation, {upsert:true}, function(err){
                    if(err){
                        console.log(err);
                    }
                });
                newLocation._id = id;
                locationList.push(newLocation);
            });
            success(res, locationList);
        }
        catch(err){
            console.log(err);
            failure(res, err, null);
            return;
        }
    }

    router.get('/location/near/:lng/:lat/distance/:radius',
        function (req, res) {
            var args = {};
            args.lng = parseFloat(req.params.lng);
            args.lat = parseFloat(req.params.lat);
            args.meter = req.params.radius;
            args.distance = utils.convertMeterToDegree(req.params.radius);
            args.res = res;
            args.id = utils.isLoggedIn(req);
            args.foursquare_token = utils.getCurrentToken(req);
            Locations.geoNear([args.lng, args.lat], {maxDistance: args.distance, num: 50}, function(err, locations){
                if(err){
                    console.log(err);
                }
                if(err || locations.length < 15){
                    args.backup = locations;
                    foursquareConfig.getLocations(args, getLocationCallback);
                }
                else{
                    var returnLocations = [];
                    locations.forEach(function(location){
                        returnLocations.push(location.obj);
                    });
                    success(res, returnLocations);
                }
            });
    });

    router.get('/location/:id',
        function (req, res) {
            res.render('user/login-token');
    });

    return router;

};
