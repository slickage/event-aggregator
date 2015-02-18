describe('main aggregator', function() {
	var path = require('path');
	var fs = require('fs');
	var agg = require('./eventprovidermodules.js');

	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	xit('imports config vars from file', function() {
		spyOn(fs, 'readFileSync').and.callThrough();

		agg.eventAggregator(); // TODO arguments
		
		expect(fs.readFileSync).toHaveBeenCalledWith('./config.json', 'utf8');
	});

	xit('fails gracefully if config file not present', function() {
		spyOn(fs, 'readFileSync').and.throwError("ENOTFOUND");

		expect(agg.eventAggregator()).toThrowError("Missing config JSON"); // TODO args
	});
	
	xit('queries all event providers by default', function() {
		// TODO find a way to generalize this for all providers procedurally

		spyOn(agg,'getEventbriteEvents').andcallThrough();
		spyOn(agg,'getMeetupEvents').andcallThrough();

		agg.eventAggregator(); // TODO args

		expect(agg.getEventbriteEvents).toHaveBeenCalled();
		expect(agg.getMeetupEvents).toHaveBeenCalled();
	});

	xit('queries a named event provider when passed the appropriate arg',
		 function() {

			 spyOn(agg,'getMeetupEvents').andcallThrough();
			 agg.eventAggregator(); // TODO args
			 expect(agg.getMeetupEvents).toHaveBeenCalled();
	});

	xit('creates a payload of events with spec-compliant structure', function() {
		var specprops = ['title', 'body', 'start', 'end', 'created_at',
										 'updated_at', 'imported'];
		
		spyOn(https, 'request').and.callThrough();
		agg.eventAggregator(); // TODO args

		// should not need async treatment
		var requestargs = https.request.calls.mostRecent(); 

		console.log(requestargs);
		expect(specprops.every(function(thisprop) { // check for all properties
			// TODO check this structure
			requestargs.something.hasOwnProperty(thisprop);
		}));
		
	});
	
	xit('makes a valid HTTPS request to the right API endpoint', function() {
		spyOn(https, 'request').and.callThrough();
			
		agg.eventAggregator(); // TODO insert args here
			
		expect(https.request).toHaveBeenCalledWith(); // TODO insert args here
	});

	xit('makes as many POST requests as there are new events', function(done) {
		// TODO get number of events found from return value, compare with
		// https.request.calls.count()

		spyOn(https, 'request').and.callThrough();

		var eventCount = agg.eventAggregator(); // TODO args

		expect(https.request.calls.count()).toBe(eventCount);
		done(); // todo check order of this and above line
	});
});
