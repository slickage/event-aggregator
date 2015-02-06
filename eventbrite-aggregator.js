// Eventbrite event searching
// Anonymous query:
// https://www.eventbriteapi.com/v3/events/search/?token=5OTKXGRDYWFRA2SWONXT
// API doc:
// https://developer.eventbrite.com/docs/event-search/
var https = require('https');
var _ = require('lodash');

// TODO move these out
var token = '5OTKXGRDYWFRA2SWONXT';

var getEventbriteEvents = function(authToken, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
  // query terms with their values
	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		var queryString = hashToGET(queryHash);
	} else { // if no query hash passed
		var queryString = '';
	}

  var options = {
    hostname: 'www.eventbriteapi.com',
		path: '/v3/events/search/?' + queryString + '&token=' + token,
		method: 'GET'
  };

  callback = function(response) { // function for async data return
    var str = '';

		console.log('HTTP', response.statusCode);
		console.log('Request header: ', JSON.stringify(response.headers));
    // for now just collect up all the data and return the whole thing as string
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      return(str);
    });
  }
	
  var getReq = https.request(options, callback);

	getReq.on('error', function (err) {
	getReq.on('error', function (err) { // for debugging request
		console.log(err);
		console.log(url);
		console.log(queryString);
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

exports['getEventbriteEvents'] = getEventbriteEvents;
