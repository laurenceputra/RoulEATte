var mongoose = require('mongoose');
var mongodb = require('./mongo.js')();

module.exports = function(){
	mongoose.connect(mongodb['uri'], {server:{auto_reconnect:true}});
	var db = mongoose.connection;
	db.on('error', function(error) {
	    mongoose.disconnect();
	});
	db.on('disconnected', function() {
	    mongoose.connect(mongodb['uri'], {server:{auto_reconnect:true}});
	});
}