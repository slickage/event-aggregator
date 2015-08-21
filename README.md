# event-aggregator

event aggregator for hnl.io


## how to use

1. `git clone`
2. `npm install`
2. optional: `npm install -g`
    3. `event-aggregator # scrape all events and POST event array to localhost:3000`

## design

The goal is to write the following functions:

- API wrappers that universalize event queries (HTTPS) for
  - Eventbrite
  - Meetup
  - others as necessary
- A function that calls the API wrappers along with a source type argument (FB,
  EB, etc.), that provides the appropriate callback to each wrapper and arranges
  the returned data into a form matching the hnl.io DB schema for insertion.

### program flow

The main function, `event-aggregator`, goes through the following steps (using
`async.waterfall`):

1. Queries all available event API providers by mapping through a JSON object
   containing the individual API query functions, and another object containing
   API config details.
3. Cleaned event lists are filtered for keywords in `config.json`, by default
   searching for keywords on their own (not part of other words).
4. Cleaned and filtered event lists from each provider are mapped into an array
   of closures containing POST requests, which are submitted using
   `async.parallel`.
5. The result is passed back out through a result callback.

## config

- `api_url`: URL string indicating the endpoint aggregated events will be POSTed
  to
- `providers`: a JSON object containing credentials for each provider:
    - `getEventbriteEvents`, `getMeetupEvents`
        - `token`: a string containing an API token for access
    - `getAllGCalEvents`:
        - `apikey`: a string containing an API key for access
        - `calids`: an array of calendar ID strings for google calendars
    - `getAllRSSEvents`:
        - `urls`: an array of URL strings for RSS feeds
- `base_location`: a JSON object containing geographic info for the events query
    - `lat`, `lon`: latitude and longitude floats for center of search
    - `radius`: integer radius in kilometers to search from center for events
- `check_frequency`: currently unused, can be used for wrapping the main command
  in a `setTimeout()` call (integer interval between queries in milliseconds)
- `filter_whole`: boolean switch indicating whether or not event titles and
  descriptions should be filtered against keywords appearing on their own (true)
  or also in other words (false)
  - `keywords`: an array of string keywords events will be filtered on.

Also: in `js/scrape-all.js` there is a `query.time_end` property that by default
is two weeks later. You may set this to a different value as you like.

### event object

An event object looks like this:

```js
{ title: 'IAPP - IT Privacy, Security, Risk Conference',
    body: '<p>Aloha everyone,  Please join me next month at the most comprehensive IT based...',
    start: '2015-08-03T16:15:14.098Z',
    upstream_created_at: '2015-08-03T16:15:14.098Z',
    upstream_updated_at: '2015-08-03T16:15:14.098Z',
    upstream_url: 'http://www.techhui.com/xn/detail/1702911:Event:134990',
    service: 'RSS' }
```

Events can be guaranteed to have at least a title, start, upstream info, and
service name.

## current status

- [ ] Eventbrite wrapper
  - [x] Tests (passing)
  - [x] Implementation
  - [ ] Docs
- [ ] Meetup wrapper
  - [x] Tests (passing)
  - [x] Implementation
  - [ ] Docs
- [ ] RSS
  - [ ] Tests (passing)
    - [x] All but one
  - [x] Implementation
  - [ ] Docs
- [x] Universal event query generator/parser
  - [x] Tests
  - [x] Implementation
	- [x] Aggregation steps
	- [x] error handling (currently loose)
  - [x] Docs
