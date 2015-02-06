// Eventbrite event searching
// Anonymous query:
// https://www.eventbriteapi.com/v3/events/search/?token=5OTKXGRDYWFRA2SWONXT
// API doc:
// https://developer.eventbrite.com/docs/event-search/
var http = require('http');
var _ = require('lodash');

// TODO move these out
var baseURL = 'https://www.eventbriteapi.com/v3/events/search/';
var token = '5OTKXGRDYWFRA2SWONXT';

var getEventbriteEvents = function(url, authToken, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values

	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		var vals = Object.keys(queryHash).map(function(thiskey) {
			return(queryHash[thiskey]);
		});
		
		var queryPairs = _.zip(Object.keys(queryHash), vals);
		var queryString = queryPairs.map(function(x) { 
			return(x[0] + '=' + x[1])
		}).reduce(function(y,z) { 
			return(y + '&' + z);
		});
	} else { // if no query hash passed
		queryString = '';
	}
	
  var options = {
    host: baseURL,
    path: queryString
  };

  callback = function(response) {
    var str = '';

    // for now just collect up all the data and return the whole thing as string
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      return(str);
    });
  }

  http.request(options, callback).end();

}

exports['getEventbriteEvents'] = getEventbriteEvents;
