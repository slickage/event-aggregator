// Eventbrite event searching
// Anonymous query:
// https://www.eventbriteapi.com/v3/events/search/?token=5OTKXGRDYWFRA2SWONXT
// API doc:
// https://developer.eventbrite.com/docs/event-search/
var https = require('https');
var hashToGET = require('./hashtoget.js');

var getEventbriteEvents = function(authToken, callback, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values

	// default if no query hash passed in
	var queryString = '';
	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		queryString = hashToGET(translateGenQuery(queryHash));
	}

  var options = {
    hostname: 'www.eventbriteapi.com',
		path: '/v3/events/search/?' + queryString + '&token=' + authToken,
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
	// create a new hash to put an Eventbrite API-compatible query in
	// predefined params
	var eventbriteQuery = {
		'location.latitude' : genQuery['lat'],
		'location.longitude' : genQuery['lon'],
		'location.within' : genQuery['radius']/1000 + "km", // in m
		// need to explicitly specify 'now'
		'start_date.range_start' : new Date().toUTCString(),
		 // convert from epoch ms to UTC
		'start_date.range_end' : new Date(genQuery['time_end']).toUTCString()
	};
};

module.exports = getEventbriteEvents;
