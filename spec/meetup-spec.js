describe('meetup event fetcher', function() {
	var https = require('https');
	var mu = require('../meetup-aggregator.js');

	beforeEach(function() { // change timeout interval
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });	


	afterEach(function() { // restore timeout interval
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
	
	it('exports a query function', function() {
		expect(typeof(mu.getMeetupEvents)).toBe('function');
	});
	
	it('submits an HTML request', function() {
		spyOn(https, 'request').and.callThrough();
		
		mu.getMeetupEvents(token);
		
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
		mu.getMeetupEvents(token, callback);//
		
	});

	it('returns valid JSON from a few common queries', function(done) {
		
		
	});
	
});
