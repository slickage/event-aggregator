var fs = require('fs');
var https = require('https');
var async = require('async');
var agg = require('./eventprovidermodules.js'); // query providers
var eventAggregator = require('./event-aggregator.js'); // main module
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// get date 2 weeks ahead
var twoWeeksLater = new Date();
twoWeeksLater = twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

var query = config.base_location;
query.time_end = twoWeeksLater.valueOf();
query.keywords = config.keywords;

// repeats check over an interval given in config.check_frequency
// setTimeout(eventAggregator(query, console.log), config.check_frequency);
eventAggregator(query, console.log);
