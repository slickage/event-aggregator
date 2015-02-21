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
	
  var options = {
    hostname: 'api.meetup.com',
		path: '/2/open_events.json?' + queryString + '&key=' + authToken,
		method: 'GET'
  };

  var getReq = https.request(options, callback);

	getReq.on('error', function (err) { // for debugging request
		console.log(err);
		console.log(url);
	});

  getReq.end();
};

var translateGenQuery = function(genQuery) {
	// create a new hash to put a Meetup API-compatible query in
	// predefined params
	var meetupQuery = {
		'lat' : genQuery['lat'],
		'lon' : genQuery['lon'],
		'radius' : genQuery['radius'],
		'time' : "," + genQuery['time_end']
	};

	return(meetupQuery);
};

module.exports = getMeetupEvents;
