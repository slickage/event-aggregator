// main aggregation function

var fs = require('fs');
var agg = require('./eventprovidermodules.js');

var eventAggregator = function() {
	try {
		var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
	} catch(err) {
		if (err.code === 'ENOENT') {
			console.log("Couldn't find config.json in the current directory.");
		} else {
			throw err;
		}
	}
}

module.exports = eventAggregator;
