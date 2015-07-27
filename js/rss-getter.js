// RSS 
var FeedParser = require('feedparser');
var request = require('request');
var concat = require('concat-stream');

var getRSSEvents = function(feedURL, callback) {
  feedURL = 'http://www.techhui.com/events/event/feed?xn_auth=no';
  var req = request(feedURL);
  var feedparser = new FeedParser();
  
  req.on('error', function (error) {
    // handle any request errors
    callback(error);
  });
  req.on('response', function (res) {
    var stream = this;
    if (res.statusCode !== 200) {
      return this.emit('error', new Error('HTTP ' + res.statusCode));
    }

    stream.pipe(feedparser).pipe(concat(function(bulkFeed) {
      callback(null, cleanEvents(bulkFeed));
    }));
  });

  feedparser.on('error', function(error) {
    // always handle errors
    callback(error);
  });
};

var cleanEvents = function(rssEvents) {
  
  // console.log(rssEvents.hasOwnProperty('results'));
  // if (!(rssEvents.hasOwnProperty('events'))) {
  //   // eventbrite doesn't complain out loud if we give a bad request, but we can
  //   // guess
  //   throw new Error('Bad request');
  // }
  if (rssEvents.length === 0) {
    // empty array case, i.e. no events
    return([]);
  }
  
	var eventArray = // this becomes an array of cleaned event objects
			rssEvents.map(function(thisEvent) {
				// fill a new event object with the spec fields
				var cleanEvent = {};
				
				cleanEvent.title = !(thisEvent.title === null) ?
          thisEvent.title : '';
				cleanEvent.body = !(thisEvent.description === null) ?
          thisEvent.description : '';
				cleanEvent.start =
          new Date(thisEvent.date).toISOString();
// 				cleanEvent.end =
//           new Date(thisEvent.end.utc).toISOString();
				cleanEvent.upstream_created_at =
          new Date(thisEvent.pubdate).toISOString();
				cleanEvent.upstream_updated_at =
          new Date(thisEvent.date).toISOString();
        cleanEvent.upstream_url = thisEvent.link;
				cleanEvent.service = 'RSS';

        return(cleanEvent);
			});
	return(eventArray);
};

module.exports = getRSSEvents;
