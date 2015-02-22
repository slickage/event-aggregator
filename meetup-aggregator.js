// Meetup event searching
// Query:
// https://www.eventbriteapi.com/2/open_events.json?key=
var https = require('https');
var hashToGET = require("./hashtoget.js");

var getMeetupEvents = function(authToken, callback, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values
	var queryString = ''; // default if no queryHash present
	
	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		queryString = hashToGET(translateGenQuery(queryHash));
	}

	var GETURL = 'https://api.meetup.com/2/open_events.json?' + queryString +
			'&key=' + authToken;

//	console.log('making event query req.');
	var GETBody = '';
	//  var getReq = https.request(options, function(res) {
	https.get(GETURL, function(res) {
		res.on('data', function(chunk) {
			GETBody += chunk.toString();
		});
		res.on('end', function() {
			callback(null, GETBody);
		});
	}).on('error', function(err) {
		callback(err);
	});
};

var translateGenQuery = function(genQuery) {
	// create a new hash to put a Meetup API-compatible query in
	// predefined params
	var meetupQuery = {
		'lat' : genQuery['lat'],
		'lon' : genQuery['lon'],
		'radius' : genQuery['radius'],
		// no need to explicitly specify 'from now' as it is default for meetup
		'time' : "," + genQuery['time_end'] // as epoch
	};
	return(meetupQuery);
};

module.exports = getMeetupEvents;
