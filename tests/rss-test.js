var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var request = require('request');
var getRSSEvents = require('../js/rss-getter.js');
var getAllRSSEvents = require('../js/rss-aggregator.js');
var config = require('../config.json');

suite('rss event fetcher (single)', function() {
	
	setup(function() {
    sinon.spy(request);
  });
  
  teardown(function() {
    request.restore();
  });
	
	it('exports a query function', function() {
		expect(getRSSEvents).to.be.an.instanceof(Function);
	});

	it('submits an HTML request', function() {
		getRSSEvents(config.providers.getAllRSSEvents.urls[0],
                  config.providers.getAllRSSEvents.apikey, function(){});

		expect(request.calledOnce);
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
		getRSSEvents(config.providers.getAllRSSEvents.urls[0], callback);
	});
	
});

suite('rss event fetcher (array)', function() {

  setup(function() {
  });
  
  teardown(function() {
  });
  
  it('exports a query function', function() {
		expect(getAllRSSEvents).to.be.an.instanceof(Function);
	});

  
	it('submits as many HTTP reqs as there are urls', function() {
    var requestSpy = sinon.spy(request);
    getAllRSSEvents(config.providers.getAllRSSEvents, console.log);
		expect(
      sinon.assert.callCount(requestSpy,
                             config.providers.getAllRSSEvents.urls.length)

    );

    request.restore();

	});
});
