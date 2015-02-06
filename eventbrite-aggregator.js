// Eventbrite event searching
// Anonymous query:
// https://www.eventbriteapi.com/v3/events/search/?token=5OTKXGRDYWFRA2SWONXT
// API doc:
// https://developer.eventbrite.com/docs/event-search/
var eb = require('node-eventbrite');

// TODO move this out
var token = '5OTKXGRDYWFRA2SWONXT';


try {
    var ebapi = eb({
      token : token,
      version : 'v3',
			DEBUG : true
    });
} catch (error) {
    console.log(error.message); // the options are missing, this function throws an error. 
}

try {
	ebapi.search({'venue.city' : 'Honolulu'},
						 function(data) {
							 return(data);
						 });
} catch (error) {
	console.log(error.message);
}
 
// ebapi.owned_events({ user_id: 30 }, function (error, data) {
//     if (error)
//         console.log(error.message);
//     else
//         console.log(JSON.stringify(data)); // Do something with your data! 
// });

// exports['getEventbriteEvents'] = getEventbriteEvents;
