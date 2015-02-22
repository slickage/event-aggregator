// main aggregation function
var https = require('https');
var fs = require('fs');
var async = require('async');
var agg = require('./eventprovidermodules.js'); // query providers

var eventAggregator = function(queryHash, providerName) {
	var config = loadConfig('./config.json');

	var areWeDoneYet = false; // MOM ARE WE THERE YET
	var eventsPOSTed = 0;
	
	async.waterfall([
		function(nextCallback) { // go get events
			nextCallback(null,
									 getEventsFromProviders(agg, config, queryHash, cleanEvents));
		},
		function(eventsList, nextCallback) { // build http requests
			nextCallback(null,
									 buildPOSTSFromEvents(eventsList));
		}
	], function(POSTArray, nextCallback) { // finally, fire away all requests
		nextCallback(null,
								 async.parallel(POSTArray, function(err, POSTResults) {
									 if (err) {
										 console.log(err);
									 } else {
										 eventsPOSTed = POSTResults.length;
										 areWeDoneYet = true;
									 }}));
	});

	
	while (areWeDoneYet === false) {} // block until finished requesting
	return (eventsPOSTed);
};

var loadConfig = function(filename) {
	// bring in config vars
	try {
		return(JSON.parse(fs.readFileSync(filename, 'utf8')));
	} catch(err) {
		if (err.code === 'ENOENT') {
			console.log("Couldn't find config.json in the current directory.");
		} else {
			throw err;
		}
	}
};

var getEventsFromProviders = function(providerArray, providerConfig, queryHash,
																			eventHandOff) {
	return(providerArray.map(function(thisProvider) {
		providerArray[thisProvider](config['providers'][thisEventQueryFunc]['token'],
																handOff, // handOff gets the HTTP response data
																queryHash);
	}));
};

