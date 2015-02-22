describe('eventbrite event fetcher', function() {
	var https = require('https');
	var getEventbriteEvents = require('../eventbrite-aggregator.js');
 	var token = '5OTKXGRDYWFRA2SWONXT';

	var testQuery = { // honolulu airport
		'lat' : 21.33,
		'lon' : 157.94,
		'radius' : 10000, // 10km
		'time_end' : new Date().valueOf()
	};
	
	beforeEach(function() { // change timeout interval for async calls
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	

	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('exports a query function', function() {
		expect(typeof(getEventbriteEvents)).toBe('function');
	});

	it('submits an HTML request', function() {
		spyOn(https, 'request').and.callThrough();

		getEventbriteEvents(token, function () {});

		expect(https.request).toHaveBeenCalled();
	});

	it('returns a JSON string of valid events', function(done) {
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.log(err);

			expect(err).toBe(null); // expect no errors
			expect(dataStr !== null); // expect data back
			if (dataStr) {
				var queryReturn = JSON.parse(dataStr);
				expect(Array.isArray(queryReturn.events));
			}
			done();
		};

		getEventbriteEvents(token, callback);
	});

	it('returns valid JSON from a spec-based query', function(done) {
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.log(err);			

			expect(err).toBe(null); // expect no errors
			expect(dataStr !== null); // expect data back
			console.log(dataStr);
			if (dataStr) {
				var queryReturn = JSON.parse(dataStr);
				console.log(queryReturn);
				expect(Array.isArray(queryReturn.events));
			}
			done();
		};
		getEventbriteEvents(token, callback, testQuery);
	});
	
});
