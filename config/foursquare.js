module.exports = function(){
	var foursquare = {};
	foursquare['clientId'] = process.env.FOURSQUARE_CLIENT_ID;
	foursquare['clientSecret'] = process.env.FOURSQUARE_CLIENT_SECRET;
	foursquare['redirect'] = encodeURIComponent(process.env.FOURSQUARE_REDIRECT);
	return foursquare;
}