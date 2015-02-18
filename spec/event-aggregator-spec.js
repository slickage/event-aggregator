describe('main aggregator', function() {
	var path = require('path');
	var fs = require('fs');
	var eventAggregator = require('../event-aggregator.js');

	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('imports config vars from file', function() {
		spyOn(fs, 'readFileSync').and.callThrough();
		expect(fs.readFileSync).toHaveBeenCalledWith('./config.json', 'utf8');
	});

	it('fails gracefully if config file not present', function() {
		spyOn(fs, 'readFileSync').and.throwError("ENOTFOUND");

		expect(eventAggregator()).toThrowError("Missing config.json"); // TODO args
	});
	
	xit('queries all event providers by default', function() {
		// TODO find a way to generalize this for all providers procedurally
	});

	xit('queries a named event provider when passed the appropriate arg',
		 function() {

	});

	xit('creates a payload of events with spec-compliant structure', function() {
		
	});
	
	xit('makes a valid HTTPS request to the right API endpoint', function() {
			spyOn(https, 'request').and.callThrough();
			
			eventAggregator(); // TODO insert args here
			
			expect(https.request).toHaveBeenCalledWith(); // TODO insert args here
	});

	xit('makes as many POST requests as there are new events', function() {
		// TODO get number of events found from return value, compare with
		// https.request.calls.count()
	});
});
