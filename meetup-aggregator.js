// Meetup event searching
// Query:
// https://www.eventbriteapi.com/2/open_events.json?key=
var https = require('https');
var hashToGET = require("./hashtoget.js");

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

module.exports = getMeetupEvents;
