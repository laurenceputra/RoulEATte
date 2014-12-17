module.exports = function(){
	var mongodb = {};
	mongodb['uri'] = process.env.MONGODB;
	return mongodb;
}