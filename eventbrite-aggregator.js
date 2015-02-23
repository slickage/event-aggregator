// Eventbrite event searching
// Anonymous query:
// https://www.eventbriteapi.com/v3/events/search/?token=5OTKXGRDYWFRA2SWONXT
// API doc:
// https://developer.eventbrite.com/docs/event-search/
var https = require('https');
var hashToGET = require('./hashtoget.js');

var getEventbriteEvents = function(authToken, callback, queryHash) {
//	console.log('getEventbriteEvents entered.');
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values

	var queryString = ''; // default if no query hash passed in

	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		queryString = hashToGET(translateGenQuery(queryHash));
	}
	var GETURL = 'https://www.eventbrite.com/json/event_search?' + queryString +
			'&app_key=' + authToken;
	var GETBody = '';

	// console.log('making event query req.');
	https.get(GETURL, function(res) {
		res.on('data', function(chunk) {
			GETBody += chunk.toString();
		});
		res.on('end', function() {
      console.log('EB: ' + res.statusCode);
			callback(null, GETBody);
		});
	}).on('error', function(err) {
		callback(err);
	});
};

var translateGenQuery = function(genQuery) {
	// create a new hash to put an Eventbrite API-compatible query in
	// predefined params
	var eventbriteQuery = {
		'location.latitude' : genQuery['lat'],
		'location.longitude' : genQuery['lon'],
		'location.within' : genQuery['radius']/1000 + "km", // in m
		// need to explicitly specify 'now'
		// eventbrite doesn't *quite* match Date.toJSON(): YYYY-MM-DDThh:mm:ssZ
		'start_date.range_start' : new Date().toJSON().slice(0,-5) + 'Z',
		 // convert from epoch ms to UTC
		'start_date.range_end' : new Date(
			genQuery['time_end']).toJSON().slice(0,-5) + 'Z'
	};

	return(eventbriteQuery);
};

module.exports = getEventbriteEvents;
