module.exports = function(){
	var gmaps = {};
	gmaps['apiKey'] = process.env.GMAPS_API_KEY;
	return gmaps;
}