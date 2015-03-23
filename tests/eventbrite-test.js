var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getEventbriteEvents = require('../eventbrite-aggregator.js');
var token = '5OTKXGRDYWFRA2SWONXT';

var testQuery = { // honolulu airport
	'lat' : 21.33,
	'lon' : -157.94,
	'radius' : 50000, // 50km
	'time_end' : new Date(2015, 11, 31).valueOf()
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

		getEventbriteEvents(token, function () {}, testQuery);

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
		getEventbriteEvents(token, callback, testQuery);
	});
	
});
