// simple manifest of exportable functions for this component
module.exports = {
	eventAggregator : require('./event-aggregator.js'),
	getEventbriteEvents : require('./eventbrite-aggregator.js'),
	getMeetupEvents : require('./meetup-aggregator.js')
}
