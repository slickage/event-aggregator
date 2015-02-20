describe('eventbrite event fetcher', function() {
	var https = require('https');
	var getEventbriteEvents = require('../eventbrite-aggregator.js');

 	var token = '5OTKXGRDYWFRA2SWONXT';

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

		getEventbriteEvents(token);

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
				var queryReturn = JSON.parse(str);

				expect(typeof(queryReturn) === 'defined');
				expect(Array.isArray(queryReturn.events));
				done();
			});
		}
		getEventbriteEvents(token, callback);

		
	});

	it('returns valid JSON from a few common queries', function(done) {
		var firstQuery = {
			'venue.city' : 'honolulu'
		};
		var secondQuery = {
			'venue.city' : 'honolulu',
			'start_date.keyword' : 'today'
		};
		var thirdQuery = {
			'location.address' : '2800 woodlawn drive'
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
				expect(Array.isArray(queryReturn.events));
				done();
			});
		}
		getEventbriteEvents(token, callback, firstQuery);
		getEventbriteEvents(token, callback, secondQuery);
		getEventbriteEvents(token, callback, thirdQuery);
	});
	
});
