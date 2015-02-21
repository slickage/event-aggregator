// main aggregation function
var https = require('https');
var fs = require('fs');
var agg = require('./eventprovidermodules.js'); // query providers

var eventAggregator = function(queryHash, singleProvider) {
	// bring in config vars
	try {
		config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
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
	var eventarr = eventProviders.map(function(thisEventQueryFunc) {
		agg[thisEventQueryFunc](config['providers'][thisEventQueryFunc]['token'],
											      function(queriedEvents) {
															submitEvents(queriedEvents, successCallback);
														}, queryHash);
		// need to do some callback counting above
	});

	
	// return total number of events successfully POSTed
	return(eventarr.reduce(function(x,y) { return(x+y); }));
};



// our callback for sending event results through the hnl.io API
var submitEvents = function(eventObj, resultCallback) {

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
  // pass array of objects to POST
  POSTEvents(eventList, config.api_url, resultCallback);
};

// functions for simplifying event provider returns so they meet spec and then
// passing them on to POSTEvents
var submitEventbriteEvents = function(rawEvents) {
  var eventList =
      rawEvents['events'].map(function(thisEvent) { // this is an array
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
  
  return(eventList);
};

var submitMeetupEvents = function(rawEvents) {
  return(rawEvents['results'].map(function(thisEvent) { // this is an array
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

	}));
};

var POSTEvents = function(eventList, apiURL, resultCallback) {

	eventList.foreach(function(thisEvent) {
		httpsPOSTEvent(thisEvent, apiURL, resultCallback);
	});
	
};

var httpsPOSTEvent = function(thisEvent, destURL, resultCallback) {
  var postOptions = {
    hostname: destURL,
    port: 443,
    path: '/',
    method: 'POST'
  };
	
	// Set up the request
  var postReq = http.request(post_opts, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
  });
  
  // post the data
  // postReq.write(eventList[thisEvent]);
  postReq.end(thisEvent, null, resultCallback);
};


// callback for reporting successful POST
var successCallback = function(callData) {
	console.log(callData);
	if (callData) {
		return 1;
	} else {
		return 0;
	}
};

module.exports = {
	eventAggregator : eventAggregator,
	httpsPOSTEvent : httpsPOSTEvent // exported for testing
};
