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
	'lon' : 157.94,
	'radius' : 10000, // 10km
	'time_end' : new Date().valueOf()
};

suite('meetup event fetcher', function() {
  setup(function() {
    sinon.spy(https, 'request');
  });
  
  teardown(function() {
    https.request.restore();
  });
  
  it('submits an HTML request', function() {
		getMeetupEvents(token, function() {}); // do-nothing callback
		expect(https.request.calledOnce);
	});

	xit('returns a JSON string of valid events', function(done) {
		// Meetup API doesn't accept key-only requests, so this test is not useful
		// at the moment.
		
		var callback = function(err, dataStr) { // function for async data return
			if (err) console.log(err);
			
			expect(dataStr); // expect dataStr not to be null
			var queryReturn = JSON.parse(dataStr);
			expect(Array.isArray(queryReturn.results));
			done();
		};
		
		getMeetupEvents(token, callback);
		
	});

	it('returns valid JSON from a spec-based query', function(done) {
		var callback = function(err, dataStr) { // function for async data return
			// if (err) console.log(err);
			
			expect(err).null; // expect no errors
			expect(dataStr).not.null; // expect data back
			if (dataStr) {
				var queryReturn = JSON.parse(dataStr);
				expect(Array.isArray(queryReturn.results));
			}
			done();
		};
		getMeetupEvents(token, callback, testQuery);
	});
});
