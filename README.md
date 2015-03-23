# event-aggregator

event aggregator for hnl.io


## design

The goal is to write the following functions:

- API wrappers that universalize event queries (HTTPS) for
  - Eventbrite
  - Meetup
  - others as necessary
- A function that calls the API wrappers along with a source type argument (FB, EB, etc.), that provides the appropriate callback to each wrapper and arranges the returned data into a form matching the hnl.io DB schema for insertion.

### program flow

The main function, `event-aggregator`, goes through the following steps (using
`async.waterfall`):

1. Queries all available event API providers by mapping through a JSON object
   containing the individual API query functions, and another object containing
   API config details.
3. Cleaned event lists from each provider are mapped into an array of closures
   containing POST requests, which are submitted using `async.parallel`.
5. The result is passed back out through a result callback.

## current status

- [ ] Eventbrite wrapper
  - [x] Tests (passing)
  - [x] Implementation
  - [ ] Docs
- [ ] Meetup wrapper
  - [x] Tests (passing)
  - [x] Implementation
  - [ ] Docs
- [ ] Facebook wrapper
  - [ ] Tests
  - [ ] Implementation
  - [ ] Docs
- [x] Universal event query generator/parser
  - [x] Tests
  - [x] Implementation
	- [x] Aggregation steps
	- [x] error handling (currently loose)
  - [x] Docs
