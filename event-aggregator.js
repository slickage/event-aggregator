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
		// STEP 1
		function(nextCallback) {
			console.log('entered first step');
			getEventsFromProviders(eventProviders, config,
														 function(err, cleanEvents) {
															 nextCallback(null, cleanEvents);
														 },
														 queryHash);
		},
    // STEP 2
		function(cleanEvents, nextCallback) {
			console.log('entered second step');
			POSTEvents(cleanEvents, config.api_url, successCallback);
		},
  ]);
};

var loadConfig = function(filename) {
	// bring in config vars
	try {
		return(JSON.parse(fs.readFileSync(filename, 'utf8')));
	} catch(err) {
		if (err.code === 'ENOENT') {
			throw new Error("Couldn't find config.json in the current directory.");
		} else {
			throw err;
		}
	}
};

// STEP 1
var getEventsFromProviders = function(providerArray, providerConfig,
																			cleanCallback, queryHash) {
	return(providerArray.map(function(thisProvider) {
		agg[thisProvider](providerConfig['providers'][thisProvider]['token'],
											function(err, resEvents) {
												if (err) { console.error(err); }
												// go straight to cleaning up received events since we
												// have the provider matching info here
												cleanCallback(err,resEvents);
											},
											queryHash);
	}));
};

// STEP 2
var POSTEvents = function(eventList, destURL, parallelCallback) {
  async.parallel(eventList.map(function(thisEvent) {
    console.log('making POST');
    return(function(individualCallback) {
		  var postOptions = {
			  hostname: destURL,
			  port: 443,
			  path: '/',
			  method: 'POST'
		  };

		  // var POSTResponse = '';
		  // Set up the request
		  var postReq = https.request(postOptions, function(res) {

			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
				  // POSTResponse += chunk.toString();
				  console.log('Response: ' + chunk);
			  });
		  }).on('error', function(err) {
			 individualCallback(err);
		  });
		  
		  // actually send the data
		  // postReq.write(eventList[thisEvent]);
		  postReq.end(JSON.stringify(thisEvent), 'utf8', individualCallback);
	  });
    
  }), parallelCallback);
  
};

module.exports = eventAggregator;
