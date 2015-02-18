// var hashToGET
var _ = require('lodash');
module.exports = function(queryHash) {
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
