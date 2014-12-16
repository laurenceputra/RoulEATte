module.exports = function(){
	var mongodb = {};
	mongodb['uri'] = process.env.MONGODB || 'mongodb://rouleatte:BggsysPjcmKgLN5HPOFB5Bz2UFru7YcN@ds061200.mongolab.com:61200/rouleatte';
	return mongodb;
}