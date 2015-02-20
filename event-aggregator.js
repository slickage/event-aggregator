// main aggregation function
var https = require('https');
var fs = require('fs');
var agg = require('./eventprovidermodules.js'); // query providers

var eventAggregator = function(queryHash, singleProvider) {
	// bring in config vars
	try {
		var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
	} catch(err) {
		if (err.code === 'ENOENT') {
			console.log("Couldn't find config.json in the current directory.");
		} else {
			throw err;
		}
	}

  var eventProviders = Object.keys(agg);
  if (typeof singleProvider !== 'undefined') { // singleProvider case
    eventProviders = [singleProvider];
  }
  
	// call each of the query providers brought in with matching configs
	eventProviders.map(function(thisEventQueryFunc) {
		agg[thisEventQueryFunc](config['providers'][thisEventQueryFunc]['token'],
											      submitEvents, queryHash);
	});
}



// our callback for sending event results through the hnl.io API
var submitEvents = function(eventObj) {

	// simplify events
	// TODO make more general, simple (hash)
	switch(submitEvents.caller.name) {
		// we know how to simplify because we know which provider the callback was
		// passed to
	case 'getEventbriteEvents' :
		var eventList = submitEventbriteEvents(eventObj);
		break;

	case 'getMeetupEvents' :
		var eventList = submitMeetupEvents(eventObj);
		break;
		
  }

  // send the event list to hnl.io
  POSTEvents(eventList, config.api_url);
};

// functions for simplifying event provider returns so they meet spec and then
// passing them on to POSTEvent, one by one
var submitEventbriteEvents = function() {
  
};

var submitMeetupEvents = function() {

};

var POSTEvents = function(eventList, apiURL) {

  // build up POST request, submit simplified event objects one by one
	for (thisEvent in eventList) {
		
	}
};

module.exports = eventAggregator;
