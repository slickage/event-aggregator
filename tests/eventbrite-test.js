var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getEventbriteEvents = require('../eventbrite-aggregator.js');
var token = '5OTKXGRDYWFRA2SWONXT';

var testQuery = { // honolulu airport
	'lat' : 21.33,
	'lon' : 157.94,
	'radius' : 10000, // 10km
	'time_end' : new Date().valueOf()
};

suite('eventbrite event fetcher', function() {
	
	setup(function() {
    sinon.spy(https, 'request');
  });
  
  teardown(function() {
    https.request.restore();
  });
	
	it('exports a query function', function() {
		expect(getEventbriteEvents).to.be.an.instanceof(Function);
	});

	it('submits an HTML request', function() {
		sinon.spy(https, 'request');

		getEventbriteEvents(token, function () {});

		expect(https.request.calledOnce);
	});

	it('returns a JSON string of valid events', function(done) {
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.log(err);

			expect(err).null; // expect no errors
			expect(dataStr).not.null; // expect data back
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

			expect(err).null; // expect no errors
			expect(dataStr).not.null; // expect data back
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
