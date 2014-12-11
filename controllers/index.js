'use strict';

var mongoose = require('mongoose');
var utils = require('./util.js');
var request = require('request');

module.exports = function (router) {

    var User = mongoose.model('user');
    var Foursquare = mongoose.model('foursquare');
    router.get('/', function (req, res) {
        function userFindCallback(err, user){
            if(err || !user){
                res.redirect('/user/logout');
                console.log(err);
                return;
            }
            Foursquare.findOne({
                id: user['id']
            }, function(err, foursquare){
                if(err){
                    res.redirect('/');
                    console.log(err);
                    return;
                }
                if(!foursquare){
                    getFoursquareLists(user['id'], user['foursquare_token']);
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
            uri: "https://api.foursquare.com/v2/users/self/lists?oauth_token=" + token + "&v=" + utils.getFoursquareVersion()
        }, function(err, response, body){
            if(err){
                console.log(err);
                return;
            }
            try{
                var lists = JSON.parse(body);
                if(lists.meta.code != 200){
                    console.log(lists);
                    throw "Error, return code not 200.";
                }
                lists = lists.response.lists.groups[0].items;
                lists.forEach(function(list){
                    request({
                        method: 'GET',
                        uri: "https://api.foursquare.com/v2/lists/" + list.id + "?oauth_token=" + token + "&v=" + utils.getFoursquareVersion()
                    }, function(err, response, body){
                        if(err){
                            console.log(err);
                            return;
                        }
                        else{
                            var list = JSON.parse(body);
                            if(list.meta.code != 200){
                                console.log("Error, return code not 200. " + list.toString());
                                return;
                            }
                            var locations = list.response.list.listItems.items;
                            var storedLocations = [];
                            locations.forEach(function(location){
                                var storedLocation = {};
                                if(location['photo']){
                                    storedLocation['photo'] = location['photo']['prefix'] + location['photo']['width'] + 'x' + location['photo']['height'] + location['photo']['suffix'];
                                }
                                storedLocation['id'] = location['venue']['id'];
                                storedLocation['name'] = location['venue']['name'];
                                storedLocation['venue'] = {};
                                storedLocation['venue']['lat'] = location['venue']['location']['lat'];
                                storedLocation['venue']['lng'] = location['venue']['location']['lng'];
                                storedLocation['venue']['address'] = location['venue']['location']['formattedAddress'];
                                storedLocation['venue']['category'] = location['venue']['categories'][0]['name'];
                                storedLocations.push(storedLocation);
                            });
                            var criteria = {
                                id: userid
                            };

                            var data = {};
                            data["lists." + list.response.list.id] = {
                                'name': list.response.list.name,
                                'locations': storedLocations
                            };
                            console.log(data);
                            Foursquare.update(criteria, {$set:data},{upsert: true}, function(err, numAffected, raw){
                                if(err){
                                    console.log(err);
                                }
                                console.log(raw);
                            })
                        }
                    })
                })
            }
            catch(err){
                console.log(err);
                return;
            }
        });
    }

};
