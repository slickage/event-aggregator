var async = require('async');
var getRSSEvents = require('./rss-getter.js');

var getAllRSSEvents = function(options, eventsCallback) {
  // this just fires getRSSEvents on an array of calIDs, does

  // console.log(options.calids);
  async.map(options.urls, getRSSEvents, function(err, results) {
    if (err) {
      eventsCallback(err);
    } else {
      // flatten the resulting array of arrays (due to multiple .map() calls)
      eventsCallback(null, [].concat.apply([],results));
    }
  });
};

module.exports = getAllRSSEvents;
