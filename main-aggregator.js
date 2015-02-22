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
		// STEP 1+2
		function(nextCallback) {
			nextCallback(null,
									 getEventsFromProviders(agg, config, queryHash));
		},
		// STEP 3
		function(cleanEvents, nextCallback) {
			nextCallback(null,
									 buildPOSTRequests(cleanEvents, config.api_url,
																		 function(thisReqRes) {
																			 return(thisReqRes);
																		 }));
		},
		// STEP 4
		function(POSTArr, nextCallback) {
			nextCallback(null,
									 async.parallel(POSTArray, function(err, POSTResults) {
										 if (err) {
											 console.log(err);
										 } else {
											 // STEP 5
											 eventsPOSTed = POSTResults.length;
											 areWeDoneYet = true;
										 }}));
		}]);

	while (areWeDoneYet === false) {} // block until above waterfall finished

	return(eventsPOSTed); // once waterfall finished, this is useful
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
																			queryHash) {
	return(providerArray.map(function(thisProvider) {
		providerArray[thisProvider](config['providers'][thisEventQueryFunc]['token'],
																// eventHandoff is a callback that gets the HTTP
																// response data
																function(resEvents) {
																	return(eventCleaners[thisEventQueryFunc](resEvents));
																},
																queryHash);
	}));
};

// STEP 2
var eventCleaners = { // functions that sanitize received events
	getEventbriteEvents : function(rawEvents) {
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
var buildPOSTRequests = function(eventList, destURL, resultCallback) {
	eventList.map(function(thisEvent) {
			return(httpsPOSTEvent(thisEvent, destURL, resultCallback));
	});
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
