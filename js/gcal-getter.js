// GCal event searching
// Query URL:
// https://www.googleapis.com/calendar/v3/calendars/{calendarid}/events?key=AIzaSyBcxfzlYVchESyN1eITak9GKyo0a1lG9K4
// (Worthless) API doc:
// https://developers.google.com/google-apps/calendar/v3/reference/calendars/get#auth
var https = require('follow-redirects').https;

var firstVal = function(obj) {
  // pseudo-first operator
  if (typeof(obj) !== 'object') {
    return obj;
  }
  return firstVal(obj[Object.keys(obj)[0]]);
};

var getGCalEvents = function(calID, authToken, callback) {
  // function expects a calendar ID string, a token for the request auth, and a
  // callback function to handle the result

	var GETURL = 'https://www.googleapis.com/calendar/v3/calendars/' + calID +
			'/events?key=' + authToken;
  // console.log(GETURL);

  var GETBody = '';
	https.get(GETURL, function(res) {
		res.on('data', function(chunk) {
			GETBody += chunk.toString();
		});
		res.on('end', function() {
      // console.log('HTTP ' + res.statusCode);
      // pass complete response body to data munger      
			callback(null, cleanEvents(GETBody));
		});
	}).on('error', function(err) {
		callback(err);
	});
};

var cleanEvents = function(rawEvents) {
  
  var gcalEvents = JSON.parse(rawEvents);
  
  if (!(gcalEvents.hasOwnProperty('items'))) {
    throw new Error('Bad request');
  }
  if (gcalEvents.items.length === 0) {
    // empty array case, i.e. no events
    return([]);
  }
  
	var eventArray = // this becomes an array of cleaned event objects
			gcalEvents.items.map(function(thisEvent) {
				// fill a new event object with the spec fields
				var cleanEvent = {};

				cleanEvent.title = !(thisEvent.summary === null) ?
          thisEvent.summary : '';
				cleanEvent.body = !(thisEvent.description === null) ?
          thisEvent.description : '';
				cleanEvent.start =
          new Date(firstVal(thisEvent.start)).toISOString();
				cleanEvent.end =
          new Date(firstVal(thisEvent.end)).toISOString();
				cleanEvent.upstream_created_at =
          new Date(thisEvent.created).toISOString();
				cleanEvent.upstream_updated_at =
          new Date(thisEvent.updated).toISOString();
        cleanEvent.upstream_url = thisEvent.htmlLink;
				cleanEvent.service = 'GCal';

        return(cleanEvent);
			});
	return(eventArray);
};

module.exports = getGCalEvents;
