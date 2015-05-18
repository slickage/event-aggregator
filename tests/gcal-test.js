var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var https = require('https');
var getGCalEvents = require('../js/gcal-getter.js');
var getAllGCalEvents = require('../js/gcal-aggregator.js');
var token = 'AIzaSyBcxfzlYVchESyN1eITak9GKyo0a1lG9K4';
var config = require('../config.json');

suite('gcal event fetcher (single)', function() {
	
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
		getGCalEvents(config.providers.getAllGCalEvents.calids[0],
                  config.providers.getAllGCalEvents.apikey, function(){});

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
		getGCalEvents(config.providers.getAllGCalEvents.calids[0],
                  config.providers.getAllGCalEvents.apikey, callback);
	});
	
});

suite('gcal event fetcher (array)', function() {

  setup(function() {
  });
  
  teardown(function() {
  });
  
  it('exports a query function', function() {
		expect(getAllGCalEvents).to.be.an.instanceof(Function);
	});

  
	it('submits as many HTTP reqs as there are calIDs', function() {
    var httpsSpy = sinon.spy(https, 'request');
    getAllGCalEvents(config.providers.getAllGCalEvents.calids,
                  config.providers.getAllGCalEvents.apikey, function(){});

		expect(
      sinon.assert.callCount(httpsSpy,
                             config.providers.getAllGCalEvents.calids.length)

    );

    https.request.restore();
    
	});

  it('submits POST requests to the API endpoint', function() {
    expect(false);
  });
});
