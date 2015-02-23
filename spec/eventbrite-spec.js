describe('eventbrite event fetcher', function() {
	var https = require('https');
	var getEventbriteEvents = require('../eventbrite-aggregator.js');
 	var token = 'HEURTPEMT2UVES6RTO';

	var testQuery = { // MIC
		'lat' : 21.308689,
		'lon' : -157.808457,
		'radius' : 10000, // 10km
		'time_end' : new Date().setTime( new Date().getTime() +
                                     '14' * 86400000 ).valueOf() // 2 weeks
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
				expect(Array.isArray(queryReturn.events));
			}
			done();
		};
		getEventbriteEvents(token, callback, testQuery);
	});
	
});
