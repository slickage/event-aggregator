// main aggregation function
var https = require('https');
var fs = require('fs');
var async = require('async');
var agg = require('./eventprovidermodules.js'); // query providers

var eventAggregator = function(queryHash, successCallback, providerName) {
	var config = loadConfig('./config.json');
	
	var eventProviders = Object.keys(agg);
	if (typeof singleProvider !== 'undefined') { // singleProvider case
		eventProviders = [singleProvider];
	}

	async.waterfall([
		// STEP 1+2
		function(nextCallback) {
//			console.log('entered first step');
			getEventsFromProviders(eventProviders, config,
														 function(err, cleanEvents) {
															 nextCallback(null, cleanEvents);
														 },
														 queryHash);
		},
		// STEP 3
		function(cleanEvents, nextCallback) {
//			console.log('entered third step');
			buildPOSTRequests(cleanEvents, config.api_url,
												function(thisReqRes) { // callback for individual reqs
													return(thisReqRes);
												},
												function(err, POSTArray) { // callback for whole array
													nextCallback(null,thisReqRes);
												});
		},
		// STEP 4
		function(POSTArray, nextCallback) {
//			console.log('entered fourth step');
			console.log(POSTArray);
			nextCallback(null,
									 async.parallel(POSTArray, function(err, POSTResults) {
										 if (err) {
											 console.log(err);
										 } else {
											 // STEP 5
											 successCallback(POSTResults.length);
										 }}));
		}
  ], function(err, result) {
    if(err) { console.error(err); }
  });
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

// STEP 1
var getEventsFromProviders = function(providerArray, providerConfig,
																			cleanCallback, queryHash) {
  
	providerArray.map(function(thisProvider) {
		agg[thisProvider](providerConfig['providers'][thisProvider]['token'],
											function(err, resEvents) {
												if (err) { console.error(err); }
												// go straight to cleaning up received events since we
												// have the provider matching info here
												cleanCallback(err,
																			eventCleaners[thisProvider](resEvents));
											},
											queryHash);
	});
};

// STEP 2
var eventCleaners = { // functions that sanitize received events
	getEventbriteEvents : function(rawEvents) {
    if(rawEvents.length < 1) {
      throw "NOEVENTS";
    }
		var eventArray = // this becomes an array of cleaned event objects
				rawEvents['events'].map(function(thisEvent) {
					// fill a new event object with the spec fields
					var cleanEvent = {};
					
					cleanEvent['title'] = thisEvent['name']['text'];
					cleanEvent['body'] = thisEvent['description']['text'];
					cleanEvent['start'] = thisEvent['start']['utc']; // TODO convert to unix ms
					cleanEvent['end'] = thisEvent['end']['utc']; // TODO convert to unix ms
					cleanEvent['created_at'] = thisEvent['created']; // TODO convert to unix ms
					cleanEvent['updated_at'] = thisEvent['changed'];
					cleanEvent['imported'] = {
						"resource_url" : thisEvent['resource_uri'],
						"service" : 'Eventbrite'
					};
				});
		return(eventArray);
	},
	getMeetupEvents : function(rawEvents) {
    if(rawEvents.length < 1) {
      throw "NOEVENTS";
    }
		var eventArray = 
				rawEvents['results'].map(function(thisEvent) { // this is an array
						// fill a new event object with the spec fields
						var cleanEvent = {};
					
					cleanEvent['title'] = thisEvent['name'];
					cleanEvent['body'] = thisEvent['description']; // TODO strip HTML?
					cleanEvent['start'] = thisEvent['time']; // TODO check if unix epoch ms
					cleanEvent['end'] = thisEvent['time'] + thisEvent['duration']; // TODO
					cleanEvent['created_at'] = thisEvent['created']; // TODO
					cleanEvent['updated_at'] = thisEvent['updated']; // TODO
					cleanEvent['imported'] = {
						"resource_url" : thisEvent['event_url'],
						"service" : 'Meetup'
					};
					
				});
		return(eventArray);
	}
};

// STEP 3
var buildPOSTRequests = function(eventList, destURL, resultCallback,
																arrayCallback) {
	arrayCallback(err, eventList.map(function(thisEvent) {
			return(httpsPOSTEvent(thisEvent, destURL, resultCallback));
	}));
};

var httpsPOSTEvent = function(thisEvent, destURL, resultCallback) {
	console.log('making POST func');
	return(function(resultCallback) {
		var postOptions = {
			hostname: destURL,
			port: 443,
			path: '/',
			method: 'POST'
		};

		// var POSTResponse = '';
		// Set up the request
		var postReq = http.request(postOptions, function(res) {

			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				// POSTResponse += chunk.toString();
				console.log('Response: ' + chunk);
			});
		}).on('error', function(err) {
			resultCallback(err);
		});
		
		// actually send the data
		// postReq.write(eventList[thisEvent]);
		postReq.end(thisEvent, 'utf8', resultCallback);
	});
};

module.exports = {
	eventAggregator : eventAggregator,
	httpsPOSTEvent : httpsPOSTEvent // exported for testing
};
