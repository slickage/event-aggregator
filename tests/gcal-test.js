var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getGCalEvents = require('../js/gcal-getter.js');
var token = 'AIzaSyBcxfzlYVchESyN1eITak9GKyo0a1lG9K4';
var calID = 'hsdc.hi@gmail.com';

suite('gcal event fetcher', function() {
	
	setup(function() {
    sinon.spy(https, 'request');
  });
  
  teardown(function() {
    https.request.restore();
  });
	
	it('exports a query function', function() {
		expect(getGCalEvents).to.be.an.instanceof(Function);
	});

	it('submits an HTML request', function() {
		sinon.spy(https, 'request');

		getGCalEvents(calID, token, function(){});

		expect(https.request.calledOnce);
	});

	it('returns valid JSON from a spec-based query', function(done) {
    this.timeout(15000); // wait 10s for API to come back
    
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
		getGCalEvents(calID, token, callback);
	});
	
});
