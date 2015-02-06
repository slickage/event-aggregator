describe('eventbrite event fetcher', function() {
	var http = require('http');
	var eb = require('../eventbrite-aggregator.js');

	
	var baseURL = 'https://www.eventbriteapi.com/v3/events/search/';
	var token = '5OTKXGRDYWFRA2SWONXT';
	var queryHash = '{}';
	
	it('exports a query function', function() {
		expect(typeof(eb.getEventbriteEvents)).toBe('function');
	});

	it('submits an HTML request', function() {
		spyOn(http, 'request').and.callThrough();

		eb.getEventbriteEvents(baseURL, token);

		expect(http.request).toHaveBeenCalled();
	});

	it('returns a JSON string of valid events', function() {
		var queryReturn = eb.getEventbriteEvents(baseURL, token);
		expect(typeof(queryReturn) == 'Object');
	});

});
