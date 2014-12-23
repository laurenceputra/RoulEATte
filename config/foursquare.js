module.exports = function(){
    var utils = require('../controllers/util.js');
    var request = require('request');

    var foursquare = {};
    foursquare['clientId'] = process.env.FOURSQUARE_CLIENT_ID;
    foursquare['clientSecret'] = process.env.FOURSQUARE_CLIENT_SECRET;
    foursquare['redirect'] = encodeURIComponent(process.env.FOURSQUARE_REDIRECT);

    foursquare.getAccessToken = function(code, callback){
        request({
            method: 'GET',
            uri: 'https://foursquare.com/oauth2/access_token?client_id=' + foursquare.clientId + '&client_secret=' + foursquare.clientSecret + '&grant_type=authorization_code&redirect_uri=' + foursquare.redirect + '&code='+code
        }, callback);
    };

    foursquare.getUserDetails = function(token, callback){
        request({
            method: 'GET',
            uri: 'https://api.foursquare.com/v2/users/self?oauth_token=' + token + '&v=' + utils.getFoursquareVersion()
        }, function(err, response, body){ callback(err, response, body, token);});
    };

    foursquare.getLocations = function(args, callback){
        request({
            method: 'GET',
            uri: 'https://api.foursquare.com/v2/venues/explore?' + (args.id ? 'oauth_token=' + args.foursquare_token : 'client_id=' + foursquare.clientId +'&client_secret=' + foursquare.clientSecret) + '&ll=' + args.lat + ',' + args.lng + '&radius=' + args.meter + '&limit=50&section=food&v=' + utils.getFoursquareVersion() + '&venuePhotos=1'
        }, function(err, response, body){
            callback(args.res, args.backup, err, response, body);
        });
    };

    foursquare.morphLocation = function(location){
        var storedLocation = {};
        if(location.photo){
            storedLocation.photo = location.photo.prefix + location.photo.width + 'x' + location.photo.height + location.photo.suffix;
        }
        else if(location.tips && location.tips[0] && location.tips[0].photo){
             storedLocation.photo = location.tips[0].photo.prefix + location.tips[0].photo.width + 'x' + location.tips[0].photo.height + location.tips[0].photo.suffix;
        }
        else if(location.venue.featuredPhotos && location.venue.featuredPhotos.items && location.venue.featuredPhotos.items[0]){
            storedLocation.photo = location.venue.featuredPhotos.items[0].prefix + location.venue.featuredPhotos.items[0].width + 'x' + location.venue.featuredPhotos.items[0].height + location.venue.featuredPhotos.items[0].suffix
        }
        else if(location.venue.categories[0] && location.venue.categories[0].icon){
            storedLocation.photo = location.venue.categories[0].icon.prefix + '100' + location.venue.categories[0].icon.suffix;
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
        return storedLocation;
    }

    return foursquare;
}