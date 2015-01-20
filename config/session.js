var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongodb = require('./mongo.js')();

module.exports = function(app){
    app.use(session({
        secret: process.env.SESSION_SECRET || "test",
        store: new MongoStore({
            url : mongodb['uri'],
            auto_reconnect: true,
        }),
        cookie: {
            maxAge: (365 * 24 * 60 * 60 * 1000)
        },
        resave: true,
        saveUninitialized: true
      })
    );
}