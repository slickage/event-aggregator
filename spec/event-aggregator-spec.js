describe('main aggregator', function() {
	var eventAggregator = require('../event-aggregator.js');

	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	xit('properly imports config vars', function() {

	});

	xit('fails gracefully if config var not present', function() {

	});
	
	xit('queries all event providers by default', function() {

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
});
