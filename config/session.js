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
            saveUninitialized: false
        }),
        cookie: {
            expires: (new Date(Date.now() + (60000 * 24 * 30))),
            maxAge: (60000 * 24 * 30)
        }
      })
    );
}