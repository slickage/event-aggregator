// Meetup event searching
// Query:
// https://www.eventbriteapi.com/2/open_events.json?key=
var https = require('https');
var _ = require('lodash');

var getMeetupEvents = function(authToken, callback, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values
	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		var queryString = hashToGET(queryHash);
	} else { // if no query hash passed
		var queryString = '';
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
}

var hashToGET = function(queryHash) {
	// converts a set of key-value pairs to a string using the typical GET
	// format of key=value&key=value&...

	// get values as array
	var vals = Object.keys(queryHash).map(function(thiskey) {
		return(queryHash[thiskey]);
	});
	// interleave keys and values
	var queryPairs = _.zip(Object.keys(queryHash), vals);
	// join as key=value string
	var queryString = queryPairs.map(function(x) { 
		return(x[0] + '=' + x[1]);
	}).reduce(function(y,z) { 
		return(y + '&' + z);
	});
}

exports['getMeetupEvents'] = getMeetupEvents;
