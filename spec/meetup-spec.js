describe('meetup event fetcher', function() {
	var https = require('https');
	var getMeetupEvents = require('../meetup-aggregator.js');

	var token = '1f2239571b3a4d192f505f185b407935';
	
	beforeEach(function() { // change timeout interval
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	


	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('exports a query function', function() {
		expect(typeof(getMeetupEvents)).toBe('function');
	});
	
	it('submits an HTML request', function() {
		spyOn(https, 'request').and.callThrough();
		
		getMeetupEvents(token);
		
		expect(https.request).toHaveBeenCalled();
	});

	it('returns a JSON string of valid events', function(done) {
		callback = function(response) { // function for async data return
			var str = '';
			
			// console.log('HTTP', response.statusCode);
			// console.log('Request header: ', JSON.stringify(response.headers));
			// for now just collect up all the data and return the whole thing as string
			response.on('data', function (chunk) {
				str += chunk;
			});
			response.on('end', function () {
				var queryReturn = JSON.parse(str); // TODO examine async behavior

				expect(typeof(queryReturn) === 'defined');
				expect(Array.isArray(queryReturn.results));
				done();
			});
		}
		getMeetupEvents(token, callback);
		
	});

	it('returns valid JSON from a few common queries', function(done) {
		var firstQuery = {
			'city' : 'honolulu'
		};
		var secondQuery = {
			'city' : 'honolulu',
			'time' : '1d'
		};
		var thirdQuery = {
			'text' : '2800 woodlawn drive'
		};

		callback = function(response) { // function for async data return
			var str = '';
			
			// console.log('HTTP', response.statusCode);
			// console.log('Request header: ', JSON.stringify(response.headers));
			// for now just collect up all the data and return the whole thing as string
			response.on('data', function (chunk) {
				str += chunk;
			});
			response.on('end', function () {
				var queryReturn = JSON.parse(str);

				expect(typeof(queryReturn) === 'defined');
				expect(Array.isArray(queryReturn.results));
				done();
			});
		}
		getMeetupEvents(token, callback, firstQuery);
		getMeetupEvents(token, callback, secondQuery);
		getMeetupEvents(token, callback, thirdQuery);
		
	});
	
});
