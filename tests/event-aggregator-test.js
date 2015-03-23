var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

var fs = require('fs');
var https = require('https');
var async = require('async');
var agg = require('../eventprovidermodules.js'); // query providers
var mainMod = require('../event-aggregator.js'); // main module
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// add test query var
var testQuery = { // honolulu airport
	'lat' : 21.33,
	'lon' : 157.94,
	'radius' : 10000, // 10km
	'time_end' : new Date().valueOf()
};

describe('main aggregator', function() {
		
	it('imports config vars from file', function() {
		sinon.spy(fs, 'readFileSync');

		mainMod.eventAggregator();
		
		expect(fs.readFileSync.calledWith('./config.json', 'utf8'));

    fs.readFileSync.restore();
	});

	it('fails gracefully if config file not present', function() {
		var fsReadFileStub = sinon.stub(fs, 'readFileSync').throws("ENOENT");
    sinon.spy(mainMod, 'eventAggregator');
		// see http://stackoverflow.com/a/4144803/2023432 for why the lambda
    // mainMod.eventAggregator({}, function() {
    // }, {});
		expect(mainMod.eventAggregator({}).threw());
    
    fs.readFileSync.restore();
    mainMod.eventAggregator.restore();
	});
	
	it('queries all event providers by default', function(done) {
		// TODO generalize this for all available providers

		sinon.spy(agg,'getEventbriteEvents');
		sinon.spy(agg,'getMeetupEvents');

		mainMod.eventAggregator(testQuery);

		expect(agg.getEventbriteEvents.called);
		expect(agg.getMeetupEvents.called);
		done();
	});

	it('queries a named event provider when passed the appropriate arg',
		 function(done) {

			 sinon.spy(agg,'getEventbriteEvents');
			 mainMod.eventAggregator(testQuery, function() {}, 'getEventbriteEvents');
			 expect(agg.getEventbriteEvents.called);
			 done();
	});

	xit('creates payloads of events with spec-compliant structure', function() {
		var specprops = ['title', 'body', 'start', 'end', 'created_at',
										 'updated_at', 'imported'];
		// pending("pending: not sure how to pluck out the payloads when they're built internal to helper functions.");

		sinon.spy(https, 'request');
		mainMod.eventAggregator(); // TODO args

		// should not need async treatment
		var requestargs = https.request.calls.mostRecent(); 

		// console.log(requestargs);
		expect(specprops.every(function(thisprop) { // check for all properties
			// TODO check this structure
			requestargs.something.hasOwnProperty(thisprop);
		}));
		
	});
	
	xit('makes a valid POST request to the right API endpoint', function(done) {
		// pending("can't seem to figure out how to spy on the args of this helper function.");
		sinon.spy(mainMod, 'httpsPOSTEvent');
			
		mainMod.eventAggregator(testQuery);
//		console.log(mainMod.httpsPOSTEvent);
//		console.log(mainMod.httpsPOSTEvent.calls.any());
		expect(mainMod.httpsPOSTEvent.calls.mostRecent().args[1]
           .to.be(config.api_url));
		done();
	});

	it('makes more than zero POST requests', function(done) {
		var callback = function(resultCount) {
			expect(resultCount > 0);
			done();
		};

		mainMod.eventAggregator(testQuery, callback);
	});
	
	xit('makes as many POST requests as there are new events', function(done) {
		// pending('need to find a way to pull the event count out before POST');
		var callback = function(resultCount) {
			expect(resultCount > 0);
			done();
		};
		
		// TODO get number of events found from return value, compare with
		// https.request.calls.count()
		spyOn(mainMod, 'httpsPOSTEvent').and.callThrough();

		var eventCount = mainMod.eventAggregator(testQuery);
		console.log('Events POSTed: ' + eventCount);
		expect(mainMod.httpsPOSTEvent.calls.count()).toBe(eventCount);
	});
});
