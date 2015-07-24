// RSS 
var FeedParser = require('feedparser');
var request = require('request');
var toArray = require('stream-to-array')

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
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
    stream.pipe(feedparser);
  });


  feedparser.on('error', function(error) {
    // always handle errors
    callback(error);
  });
  feedparser.on('readable', function() {
    var stream = this;
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    stream.toArray = toArray;
    stream.toArray(function(err, arr){
      callback(null, cleanEvents(arr));
    });
  });  
};

var cleanEvents = function(rssEvents) {
  
  // console.log(rssEvents.hasOwnProperty('results'));
  // if (!(rssEvents.hasOwnProperty('events'))) {
  //   // eventbrite doesn't complain out loud if we give a bad request, but we can
  //   // guess
  //   throw new Error('Bad request');
  // }
  if (rssEvents.events.length === 0) {
    // empty array case, i.e. no events
    return([]);
  }
  
	var eventArray = // this becomes an array of cleaned event objects
			rssEvents.map(function(thisEvent) {
				// fill a new event object with the spec fields
				var cleanEvent = {};
				
				cleanEvent.title = !(thisEvent.title === null) ?
          thisEvent.name.text : '';
				cleanEvent.body = !(thisEvent.description === null) ?
          thisEvent.description.text : '';
				cleanEvent.start =
          new Date(thisEvent.date.utc).toISOString();
// 				cleanEvent.end =
//           new Date(thisEvent.end.utc).toISOString();
				cleanEvent.upstream_created_at =
          new Date(thisEvent.pubdate).toISOString();
				cleanEvent.upstream_updated_at =
          new Date(thisEvent.date).toISOString();
        cleanEvent.upstream_url = thisEvent.source.url;
				cleanEvent.service = 'RSS';

        return(cleanEvent);
			});
	return(eventArray);
};
