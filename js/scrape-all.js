var fs = require('fs');
var https = require('https');
var async = require('async');
var agg = require('./eventprovidermodules.js'); // query providers
var eventAggregator = require('./event-aggregator.js'); // main module
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// get date 2 weeks ahead
var twoWeeksLater = new Date();
twoWeeksLater = twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

var query = { // honolulu airport
	'lat' : 21.33,
	'lon' : -157.94,
	'radius' : 1000000, // 1000km
	'time_end' : twoWeeksLater.valueOf(),
  'keywords' : config.keywords
};

eventAggregator(query, console.log);
