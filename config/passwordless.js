var passwordless = require("passwordless");
var MongoStore = require('passwordless-mongostore');

var mongodb = require('./mongo.js')();

module.exports = function(app){
    passwordless.init(new MongoStore(mongodb['uri']));

    passwordless.addDelivery(
        function(tokenToSend, uidToSend, recipient, callback){
            console.log(tokenToSend);
            callback();
        });
    app.use(passwordless.sessionSupport());
    app.use(passwordless.acceptToken({ successRedirect: '/user/foursquare'}));
}