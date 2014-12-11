var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongodb = require('./mongo.js')();

module.exports = function(app){
    app.use(session({
        secret: process.env.SESSION_SECRET || "test",
        store: new MongoStore({
            url : mongodb['uri'],
            auto_reconnect: true,
            resave: true,
            saveUninitialized: true
        })
      })
    );
}