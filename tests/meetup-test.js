var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getMeetupEvents = require('../js/meetup-aggregator.js');
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


suite('meetup event fetcher', function() {
  setup(function() {
    sinon.spy(https, 'request');
  });
  
  teardown(function() {
    https.request.restore();
  });
  
  it('submits an HTML request', function() {
		getMeetupEvents(config.providers.getMeetupEvents, function() {}, testQuery); // do-nothing callback
		expect(https.request.calledOnce);
	});

	it('returns an array from a spec-based query', function(done) {
    this.timeout(15000); // increase timeout to wait for meetup
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.error(err);
			
			expect(err).null; // expect no errors
			expect(dataStr).not.null; // expect data back
			if (dataStr) {
				expect(Array.isArray(dataStr));
			}
			done();
		};

    // this passes its result to the callback above
		getMeetupEvents(config.providers.getMeetupEvents, callback, testQuery);
	});
});
