// Facebook event searching
// Query:
// GET https://graph.facebook.com/v2.2/{group-id}/events/
// API doc:
// https://developers.facebook.com/docs/graph-api/reference/v2.2/group/events
var https = require('https');
var _ = require('lodash');

var getFacebookEvents = function(authToken, callback, queryHash) {
  // function expects a base url, a token for the request auth, and a hash of
	// query terms as key-val pairs

	// snatch out groupID from query hash, remove it from hash
	var groupID = queryHash.groupID;
	delete queryHash.groupID;
	
  // remaining terms with their values convert to URL
	if (typeof(queryHash) !== 'undefined') { // if query hash passed
		var queryString = hashToGET(queryHash);
	} else { // if no query hash passed
		var queryString = '';
	}


  var options = {
    hostname: 'graph.facebook.com',
		path: '/v2.2/' + groupID + '/events/' + queryString + '&key=' + authToken,
		method: 'GET'
  };

  var getReq = https.request(options, callback);

	getReq.on('error', function (err) { // for debugging request
		console.log(err);
		console.log(url);
	});

	// TODO we need to do way more parsing on our since since FB doesn't care
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

exports['getFacebookEvents'] = getFacebookEvents;
