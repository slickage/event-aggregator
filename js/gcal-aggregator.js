var async = require('async');
var getGCalEvents = require('./gcal-getter.js');

var getAllGCalEvents = function(options, eventsCallback) {
  // this just fires getGCalEvents on an array of calIDs, does

  // curry gcal getter so that only calID and single callback are necessary
  var getGCalEventsPreConfig = function(calID, singleCallback) {
    return getGCalEvents(calID, options.apikey, singleCallback);
  };

  // console.log(options.calids);
  async.map(options.calids, getGCalEventsPreConfig, function(err, results) {
    if (err) {
      eventsCallback(err);
    } else {
      // flatten the resulting array of arrays (due to multiple .map() calls)
      eventsCallback(null, [].concat.apply([],results));
    }
  });
};

module.exports = getAllGCalEvents;
