describe('main aggregator', function() {
	var fs = require('fs');
	var https = require('https');
	var agg = require('../eventprovidermodules.js'); // query providers
  var mainMod = require('../event-aggregator.js'); // main module
	var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

		var testQuery = { // honolulu airport
			'lat' : 21.33,
			'lon' : 157.94,
			'radius' : 10000, // 10km
			'time' : new Date().valueOf()
		};
		
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('imports config vars from file', function() {
		spyOn(fs, 'readFileSync').and.callThrough();

		mainMod.eventAggregator();
		
		expect(fs.readFileSync).toHaveBeenCalledWith('./config.json', 'utf8');
	});

	it('fails gracefully if config file not present', function() {
		spyOn(fs, 'readFileSync').and.throwError("ENOTFOUND");

		// see http://stackoverflow.com/a/4144803/2023432 for why the lambda
		expect(function() {mainMod.eventAggregator({})}).toThrowError();
	});
	
	it('queries all event providers by default', function() {
		// TODO generalize this for all available providers

		spyOn(agg,'getEventbriteEvents').and.callThrough();
		spyOn(agg,'getMeetupEvents').and.callThrough();

		mainMod.eventAggregator();

		expect(agg.getEventbriteEvents).toHaveBeenCalled();
		expect(agg.getMeetupEvents).toHaveBeenCalled();
	});

	it('queries a named event provider when passed the appropriate arg',
		 function() {

			 spyOn(agg,'getEventbriteEvents').and.callThrough();
			 mainMod.eventAggregator(testQuery, 'getEventbriteEvents');
			 expect(agg.getEventbriteEvents).toHaveBeenCalled();
	});

	it('creates payloads of events with spec-compliant structure', function() {
		var specprops = ['title', 'body', 'start', 'end', 'created_at',
										 'updated_at', 'imported'];
		pending("Not sure how to pluck out the payloads when they're built internal to helper functions.");

		spyOn(https, 'request').and.callThrough();
		mainMod.eventAggregator(); // TODO args

		// should not need async treatment
		var requestargs = https.request.calls.mostRecent(); 

		// console.log(requestargs);
		expect(specprops.every(function(thisprop) { // check for all properties
			// TODO check this structure
			requestargs.something.hasOwnProperty(thisprop);
		}));
		
	});
	
	it('makes a valid POST request to the right API endpoint', function(done) {
		spyOn(mainMod, 'httpsPOSTEvent').and.callThrough();
			
		mainMod.eventAggregator(); // TODO insert args here

		expect(mainMod.httpsPOSTEvent.calls.mostRecent().args[1]).toBe(config.api_url);
		done();
	});

	it('makes as many POST requests as there are new events', function(done) {
		// TODO get number of events found from return value, compare with
		// https.request.calls.count()
		spyOn(mainMod, 'httpsPOSTEvent').and.callThrough();

		var eventCount = mainMod.eventAggregator(); // TODO args

		expect(mainMod.httpsPOSTEvent.calls.count()).toBe(eventCount);
		done(); // todo check order of this and above line
	});
});
