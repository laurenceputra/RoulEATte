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

utils.prototype.getFoursquareVersion = function(){
    var currentDate = new Date();
    var twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);  
    var twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
    var createdDate = '' + currentDate.getFullYear() + twoDigitMonth + twoDigitDate;

    return createdDate;
};
module.exports = new utils();

