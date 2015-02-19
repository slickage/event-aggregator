// simple manifest of exportable functions for this component
module.exports = {
	getEventbriteEvents : require('./eventbrite-aggregator.js'),
	getMeetupEvents : require('./meetup-aggregator.js')
}
