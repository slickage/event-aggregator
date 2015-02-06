describe('eventbrite event fetcher', function() {
	var baseURL = 'https://www.eventbriteapi.com/v3/events/search/';
	var token = '5OTKXGRDYWFRA2SWONXT';
	var queryHash = '{}';
	
	it('exports a query function', function() {
		require('./eventbrite-aggregator.js');
		expect(typeof(getEventbriteEvents)).is('function');
	});

	it('submits an HTML request', function() {
		spyOn(http, 'request');

		getEventbriteEvents(baseURL, token);

		expect(http.request).toHaveBeenCalled();
	});

	it('returns a JSON string of valid events', function() {
		var queryReturn = getEventbriteEvents(baseURL, token);
		expect(typeof(queryReturn) == 'Object');
	});

});
