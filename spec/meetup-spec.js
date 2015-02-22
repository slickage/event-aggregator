describe('meetup event fetcher', function() {
	var https = require('https');
	var getMeetupEvents = require('../meetup-aggregator.js');
	var token = '1f2239571b3a4d192f505f185b407935';

	// add test query var
	var testQuery = { // honolulu airport
		'lat' : 21.33,
		'lon' : 157.94,
		'radius' : 10000, // 10km
		'time_end' : new Date().valueOf()
	};
	
	beforeEach(function() { // change timeout interval
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // 10s
  });	


	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('exports a query function', function() {
		expect(typeof(getMeetupEvents)).toBe('function');
	});
	
	it('submits an HTML request', function() {
		spyOn(https, 'request').and.callThrough();
		
		getMeetupEvents(token, console.log);
		
		expect(https.request).toHaveBeenCalled();
	});

	it('returns a JSON string of valid events', function(done) {
		pending("Meetup API doesn't accept key-only requests, so this test is not useful at the moment.");
		
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.log(err);
			
			expect(dataStr); // expect dataStr not to be null
			var queryReturn = JSON.parse(dataStr);
			expect(Array.isArray(queryReturn.results));
			done();
		};
		
		getMeetupEvents(token, callback);
		
	});

	it('returns valid JSON from a spec-based query', function(done) {
		var callback = function(err, dataStr) { // function for async data return
			// if (err) console.log(err);
			
			expect(err).toBe(null); // expect no errors
			expect(dataStr !== null); // expect data back
			if (dataStr) {
				var queryReturn = JSON.parse(dataStr);
				expect(Array.isArray(queryReturn.results));
			}
			done();
		};
		getMeetupEvents(token, callback, testQuery);
	});
});
