// main aggregation function
var request = require('request');
var fs = require('fs');
var async = require('async');
var agg = require('./eventprovidermodules.js'); // query providers


var firstVal = function(obj) {
  // pseudo-first operator
  if (typeof(obj) !== 'object') {
    return obj;
  }
  return firstVal(obj[Object.keys(obj)[0]]);
};


var eventAggregator = function(queryHash, successCallback, providerName) {
	var config = loadConfig('./config.json');
	
	var eventProviders = Object.keys(agg);
	if (typeof providerName !== 'undefined') { // singleProvider case
		eventProviders = [providerName];
	}

	async.waterfall([
		// STEP 1
		function(nextCallback) {
			getEventsFromProviders(eventProviders, config,
														 function(err, cleanEvents) {
															 nextCallback(null, cleanEvents);
														 },
														 queryHash);
		},
    // STEP 2
    function(cleanEvents, nextCallback) {
      keywordFilter(cleanEvents, config,
                    function(err, filteredEvents) {
                      nextCallback(null, filteredEvents);
                    });
    },
    // STEP 3
		function(filteredEvents /*, nextCallback */) {
      POSTEvents(filteredEvents, config.api_url, successCallback);
		}    
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
		agg[thisProvider](providerConfig['providers'][thisProvider],
											function(err, resEvents) {
												if (err) {
                          console.error(err);
                          throw err;
                        }
												cleanCallback(null, resEvents);
											},
											queryHash);
	}));
};

// STEP 2
var keywordFilter = function(eventList, config, callback) {
  // check each of the event titles and descriptions for at least one of the
  // keywords in config.keywords. If not present, drop the event from the array.
  var keywords = config.keywords;
  // if we're matching keywords against whole words and not parts of other words
  var delimiter = config.filter_whole? " " : "";
  var filteredEvents = eventList.filter(function(thisEvent){
    return keywords.some(function(thisKeyword) {
      var bodyHas, titleHas = false;
      if (thisEvent !== null) {
        if (thisEvent.body !== undefined) {
          bodyHas = thisEvent.body.indexOf(thisKeyword + delimiter) > -1;
        }
        if (thisEvent.title !== undefined) {
          titleHas = thisEvent.title.indexOf(thisKeyword + delimiter) > -1;
        }
      }
        return bodyHas || titleHas;
    });
  });
  debugger;
  callback(null, filteredEvents);
};

// STEP 3
var POSTEvents = function(eventList, destURL, parallelCallback) {
  async.parallel(eventList.map(function(thisEvent) {
    return(function(individualCallback) {

      var postOptions = {
			  url: destURL,
			  method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        form: {
          event: thisEvent
        }
		  };
      console.log('POSTing ' + thisEvent.service +
                  ' event to: ' + destURL);

      request.post(postOptions, individualCallback);
    });
  }), parallelCallback);
};

module.exports = eventAggregator;
