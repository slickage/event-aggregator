// Meetup event searching
// Query:
// https://www.eventbriteapi.com/2/open_events.json?key=
var https = require('https');
var striptags = require('striptags');
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
  // console.log(GETURL);
  
	var GETBody = '';
	https.get(GETURL, function(res) {
		res.on('data', function(chunk) {
			GETBody += chunk.toString();
		});
		res.on('end', function() {
      // pass complete response body to data munger
      callback(null, cleanEvents(GETBody));
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

var cleanEvents = function(rawEvents) {
  var meetupEvents = JSON.parse(rawEvents);
  // console.log('meetup events response: ');
  // console.log(meetupEvents.results);

  if (!(meetupEvents.hasOwnProperty('results'))) {
    // meetup will complain if we provide it with a bad request
    throw new Error('Bad request');
  }
  if (meetupEvents.results.length === 0) {
    // empty array case, i.e. no events
    return([]);
  }
  
	var eventArray = 
			meetupEvents.results.map(function(thisEvent) { // this is an array
        // fill a new event object with the spec fields
				var cleanEvent = {};
        
				cleanEvent.title = thisEvent.name;
				cleanEvent.body = !(thisEvent.description === undefined) ?
          striptags(thisEvent.description) : '';
				cleanEvent.start = thisEvent.time;
				cleanEvent.end = thisEvent.time + thisEvent.duration;
				cleanEvent.resource_created_at = thisEvent.created;
				cleanEvent.resource_updated_at = thisEvent.updated;
				cleanEvent.resource_url = thisEvent.event_url;
			  cleanEvent.service = 'Meetup';

        return(cleanEvent);
			});
	return(eventArray);
  
};

module.exports = getMeetupEvents;
