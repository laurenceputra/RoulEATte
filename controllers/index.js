'use strict';

var mongoose = require('mongoose');
var utils = require('./util.js');
var request = require('request');

module.exports = function (router) {

    var User = mongoose.model('user');
    var Foursquare = mongoose.model('foursquare');
    var Locations = mongoose.model('location');

    router.get('/', function (req, res) {
        function userFindCallback(err, user){
            if(err || !user){
                res.redirect('/user/logout');
                console.log(err);
                return;
            }
            Foursquare.findOne({
                id: user.id
            }, function(err, foursquare){
                if(err){
                    res.redirect('/');
                    console.log(err);
                    return;
                }
                if(!foursquare){
                    getFoursquareLists(user.id, user.foursquare_token);
                }
                res.render('app/app');
            });
        }
        if(utils.isLoggedIn(req)){
            User.findOne({
                _id:mongoose.Types.ObjectId(utils.isLoggedIn(req))
            }, userFindCallback);
        }
        else{
            res.render('app/app');
        }
        
        
    });

    function getFoursquareLists(userid, token){
        request({
            method: 'GET',
            uri: 'https://api.foursquare.com/v2/users/self/lists?oauth_token=' + token + '&v=' + utils.getFoursquareVersion()
        }, function(err, response, body){
            if(err){
                console.log(err);
                return;
            }
            try{
                var lists = JSON.parse(body);
                if(lists.meta.code !== 200){
                    console.log(lists);
                    throw 'Error, return code not 200.';
                }
                lists = lists.response.lists.groups[0].items;
                lists.forEach(function(list){
                    request({
                        method: 'GET',
                        uri: 'https://api.foursquare.com/v2/lists/' + list.id + '?oauth_token=' + token + '&v=' + utils.getFoursquareVersion()
                    }, function(err, response, body){
                        if(err){
                            console.log(err);
                            return;
                        }
                        else{
                            var list = JSON.parse(body);
                            if(list.meta.code !== 200){
                                console.log('Error, return code not 200. ' + list.toString());
                                return;
                            }
                            var locations = list.response.list.listItems.items;
                            var storedLocations = [];
                            locations.forEach(function(location){
                                var storedLocation = {};
                                if(location.photo){
                                    storedLocation.photo = location.photo.prefix + location.photo.width + 'x' + location.photo.height + location.photo.suffix;
                                }
                                storedLocation._id = location.venue.id;
                                storedLocation.name = location.venue.name;
                                storedLocation.coords = [];
                                storedLocation.coords.push(location.venue.location.lng);
                                storedLocation.coords.push(location.venue.location.lat);
                                if(location.venue.location.formattedAddress){
                                    storedLocation.address = location.venue.location.formattedAddress.join(' ');
                                }
                                storedLocation.category = location.venue.categories[0].name;
                                storedLocations.push(storedLocation);
                            });

                            var data = {};
                            data['lists.' + list.response.list.id] = {
                                'name': list.response.list.name,
                                'list': storedLocations
                            };
                            data._id = userid;
                            data.expires = Date.now();

                            Foursquare.update({_id: userid}, {$set: data}, {upsert: true}, function(err){
                                if(err){
                                    console.log(err);
                                }
                            });
                                
                            storedLocations.forEach(function(location){
                                var id = location._id;
                                delete location._id;
                                location.expires = Date.now();
                                Locations.update({_id: id}, {$set: location}, {upsert:true}, function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            });
                        }
                    });
                });
            }
            catch(err){
                console.log(err);
                return;
            }
        });
    }

};
