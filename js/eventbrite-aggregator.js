// Eventbrite event searching
// Anonymous query:
// https://www.eventbriteapi.com/v3/events/search/?token=5OTKXGRDYWFRA2SWONXT
// API doc:
// https://developer.eventbrite.com/docs/event-search/
var https = require('follow-redirects').https;
var hashToGET = require('./hashtoget.js');

var getEventbriteEvents = function(options, callback, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values
  var authToken = options.token;

	var queryString = ''; // default if no query hash passed in

	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		queryString = hashToGET(translateGenQuery(queryHash));
	}

	var GETURL = 'https://www.eventbriteapi.com/v3/events/search?' + queryString +
			'&token=' + authToken;

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
			genQuery['time_end']).toJSON().slice(0,-5) + 'Z',
    'q' : genQuery['keywords'].join(',')
	};

	return(eventbriteQuery);
};

var cleanEvents = function(rawEvents) {
  
  var eventbriteEvents = JSON.parse(rawEvents);
  if (!(eventbriteEvents.hasOwnProperty('events'))) {
    // eventbrite doesn't complain out loud if we give a bad request, but we can
    // guess
    throw new Error('Bad request');
  }
  if (eventbriteEvents.events.length === 0) {
    // empty array case, i.e. no events
    return([]);
  }
  
	var eventArray = // this becomes an array of cleaned event objects
			eventbriteEvents.events.map(function(thisEvent) {
				// fill a new event object with the spec fields
				var cleanEvent = {};
				
				cleanEvent.title = !(thisEvent.name === null) ?
          thisEvent.name.text : '';
				cleanEvent.body = !(thisEvent.description === null) ?
          thisEvent.description.text : '';
				cleanEvent.start =
          new Date(thisEvent.start.utc).toISOString();
				cleanEvent.end =
          new Date(thisEvent.end.utc).toISOString();
				cleanEvent.upstream_created_at =
          new Date(thisEvent.created).toISOString();
				cleanEvent.upstream_updated_at =
          new Date(thisEvent.changed).toISOString();
        cleanEvent.upstream_url = thisEvent.resource_uri;
				cleanEvent.service = 'Eventbrite';

        return(cleanEvent);
			});
	return(eventArray);
};

module.exports = getEventbriteEvents;
