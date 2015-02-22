# event-aggregator

event aggregator for hnl.io


## design

The goal is to write the following functions:

- API wrappers that universalize event queries (HTTPS) for
  - Facebook
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
   2. Received events are remapped to a simpler structure through a quick
      blocking call to helper functions.
3. Cleaned event lists from each provider are mapped into an array of closures
   containing POST requests.
4. The array POST requests is submitted using `async.parallel`.
5. `async.parallel` returns an array of POST responses, which are then handled
   by the callback `event-aggregator` itself takes.

## current status

- [ ] Eventbrite wrapper
  - [x] Tests (passing)
  - [x] Implementation
  - [ ] Docs
- [ ] Meetup wrapper
  - [x] Tests (passing)
  - [ ] Implementation
    - [ ] needs check of async conversion from XML to JSON
  - [ ] Docs
- [ ] Facebook wrapper
  - [ ] Tests
  - [ ] Implementation
  - [ ] Docs
- [ ] Universal event query generator/parser
  - [ ] Tests
  - [ ] Implementation
  - [ ] Docs
