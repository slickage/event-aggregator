var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getMeetupEvents = require('../meetup-aggregator.js');
var token = '1f2239571b3a4d192f505f185b407935';

// add test query var
var testQuery = { // honolulu airport
	'lat' : 21.33,
	'lon' : -157.94,
	'radius' : 50000, // 10km
	'time_end' : new Date(2015, 11, 31).valueOf()
};

suite('meetup event fetcher', function() {
  setup(function() {
    sinon.spy(https, 'request');
  });
  
  teardown(function() {
    https.request.restore();
  });
  
  it('submits an HTML request', function() {
		getMeetupEvents(token, function() {}, testQuery); // do-nothing callback
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
		getMeetupEvents(token, callback, testQuery);
	});
});
