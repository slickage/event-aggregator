describe('main aggregator', function() {
	var fs = require('fs');
	var agg = require('../eventprovidermodules.js'); // query providers
	// lump in the main function also for testing convenience
  eventAggregator = require('../event-aggregator.js'); 

	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('imports config vars from file', function() {
		spyOn(fs, 'readFileSync').and.callThrough();

		eventAggregator(); // TODO arguments
		
		expect(fs.readFileSync).toHaveBeenCalledWith('./config.json', 'utf8');
	});

	it('fails gracefully if config file not present', function() {
		spyOn(fs, 'readFileSync').and.throwError("ENOTFOUND");

		// see http://stackoverflow.com/a/4144803/2023432 for why the lambda
		expect(function() {eventAggregator({})}).toThrowError(); // TODO args
	});
	
	it('queries all event providers by default', function() {
		// TODO generalize this for all available providers

		spyOn(agg,'getEventbriteEvents').and.callThrough();
		spyOn(agg,'getMeetupEvents').and.callThrough();

		eventAggregator(); // TODO args

		expect(agg.getEventbriteEvents).toHaveBeenCalled();
		expect(agg.getMeetupEvents).toHaveBeenCalled();
	});

	it('queries a named event provider when passed the appropriate arg',
		 function() {

			 spyOn(agg,'getEventbriteEvents').and.callThrough();
			 eventAggregator({'dog' : 'cat'}, 'getEventbriteEvents'); // TODO args
			 expect(agg.getEventbriteEvents).toHaveBeenCalled();
	});

	it('creates a payload of events with spec-compliant structure', function() {
		var specprops = ['title', 'body', 'start', 'end', 'created_at',
										 'updated_at', 'imported'];
		pending("Not sure how to pluck out the payloads when they're built internal to helper functions.");

		spyOn(https, 'request').and.callThrough();
		eventAggregator(); // TODO args

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
			
		eventAggregator(); // TODO insert args here
			
		expect(https.request).toHaveBeenCalledWith(); // TODO insert args here
	});

	xit('makes as many POST requests as there are new events', function(done) {
		// TODO get number of events found from return value, compare with
		// https.request.calls.count()

		spyOn(https, 'request').and.callThrough();

		var eventCount = eventAggregator(); // TODO args

		expect(https.request.calls.count()).toBe(eventCount);
		done(); // todo check order of this and above line
	});
});
