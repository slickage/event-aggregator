describe('main aggregator', function() {
	var fs = require('fs');
	var https = require('https');
	var async = require('async');
	var agg = require('../js/eventprovidermodules.js'); // query providers
  var eventAggregator = require('../js/event-aggregator.js'); // main module
	var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

	// add test query var
	var testQuery = { // honolulu airport
		'lat' : 21.33,
		'lon' : -157.94,
		'radius' : 50000, // 10km
		'time_end' : new Date(2015, 11, 31).valueOf()
	};
	
	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('imports config vars from file', function() {
		spyOn(fs, 'readFileSync').and.callThrough();

		eventAggregator(testQuery, function() {});
		
		expect(fs.readFileSync).toHaveBeenCalledWith('./config.json', 'utf8');
	});

	it('fails gracefully if config file not present', function() {
		spyOn(fs, 'readFileSync').and.throwError("ENOTFOUND");

		// see http://stackoverflow.com/a/4144803/2023432 for why the lambda
		expect(function(){eventAggregator(testQuery, function() {});})
      .toThrowError();
	});
	
	it('queries all event providers by default', function(done) {
		// TODO generalize this for all available providers

		spyOn(agg,'getEventbriteEvents').and.callThrough();
		spyOn(agg,'getMeetupEvents').and.callThrough();

		eventAggregator(testQuery, function() {
      expect(agg.getEventbriteEvents).toHaveBeenCalled();
		  expect(agg.getMeetupEvents).toHaveBeenCalled();
      done();
    });
	});

	it('queries a named event provider when passed the appropriate arg',
		 function(done) {

			 spyOn(agg,'getEventbriteEvents').and.callThrough();
			 eventAggregator(testQuery, function() {
         expect(agg.getEventbriteEvents).toHaveBeenCalled();
			   done();
       }, 'getEventbriteEvents');
	});

	it('creates payloads of events with spec-compliant structure', function() {
		var specprops = ['title', 'body', 'start', 'end', 'created_at',
										 'updated_at', 'imported'];
		pending("pending: not sure how to pluck out the payloads when they're built internal to helper functions.");

		spyOn(https, 'request').and.callThrough();
		eventAggregator(testQuery, function() {}); // TODO args

		// should not need async treatment
		var requestargs = https.request.calls.mostRecent(); 

		// console.log(requestargs);
		expect(specprops.every(function(thisprop) { // check for all properties
			// TODO check this structure
			requestargs.something.hasOwnProperty(thisprop);
		}));
		
	});
	
	it('makes a valid POST request to the right API endpoint', function(done) {
		pending("can't seem to figure out how to spy on the args of this helper function.");
		spyOn(mainMod, 'httpsPOSTEvent').and.callThrough();
			
		eventAggregator(testQuery, function() {});
//		console.log(httpsPOSTEvent);
//		console.log(httpsPOSTEvent.calls.any());
		expect(httpsPOSTEvent.calls.mostRecent().args[1]).toBe(config.api_url);
		done();
	});

	it('makes more than zero POST requests', function(done) {
		var callback = function(err, result) {
			expect(err || result);
			done();
		};

		eventAggregator(testQuery, callback);
	});
	
	it('makes as many POST requests as there are new events', function(done) {
		pending('need to find a way to pull the event count out before POST');
		var callback = function(resultCount) {
			expect(resultCount > 0);
			done();
		};
		
		// TODO get number of events found from return value, compare with
		// https.request.calls.count()

    // i.e.: 
    // spyOn(mainMod, 'httpsPOSTEvent').and.callThrough();
    // expect(httpsPOSTEvent.calls.count()).toBe(eventCount);
    
		var eventCount = eventAggregator(testQuery, function(err, result) {
      // console.log('Events POSTed: ' + eventCount);
      expect(err || result);
      done();
    });
	});
});
