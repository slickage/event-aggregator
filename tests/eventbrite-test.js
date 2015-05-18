var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getEventbriteEvents = require('../js/eventbrite-aggregator.js');
var config = require('../config.json');

// get date 2 weeks ahead
var twoWeeksLater = new Date();
twoWeeksLater = twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

// add test query var
var testQuery = { // honolulu airport
	'lat' : 21.33,
	'lon' : -157.94,
	'radius' : 1000000, // 1000km
	'time_end' : twoWeeksLater.valueOf(),
  'keywords' : config.keywords
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

		getEventbriteEvents(config.providers.getEventbriteEvents, function () {}, testQuery);

		expect(https.request.calledOnce);
	});

	it('returns valid JSON from a spec-based query', function(done) {
    this.timeout(15000); // wait 15s for eventbrite API to come back
    
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.error(err);			

			expect(err).null; // expect no errors
			expect(dataStr).not.null; // expect data back
			// console.log(dataStr);
			if (dataStr) {
				expect(Array.isArray(dataStr));
			}
			done();
		};
		getEventbriteEvents(config.providers.getEventbriteEvents, callback, testQuery);
	});
	
});
