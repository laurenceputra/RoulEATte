'use strict';

var utils = function(){};

utils.prototype.requireLogIn = function(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('/user/foursquare');
    }
    else {
        next();
    }
};

utils.prototype.noLoggedIn = function(req, res, next) {
    if (req.session.user_id) {
        res.redirect('/');
    }
    else {
        next();
    }
};

utils.prototype.isLoggedIn = function(req){
    return req.session.user_id;
};

utils.prototype.getCurrentToken = function(req){
    return req.session.foursquare_token;
};

utils.prototype.getFoursquareVersion = function(){
    var currentDate = new Date();
    var twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);  
    var twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
    var createdDate = '' + currentDate.getFullYear() + twoDigitMonth + twoDigitDate;

    return createdDate;
};

utils.prototype.convertMeterToDegree = function(meter){
    return (meter/1000) / 111.12;
};

//code copied from http://stackoverflow.com/a/27943
utils.prototype.distanceBetweenPointsInMeter = function(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000;
};

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

module.exports = new utils();

