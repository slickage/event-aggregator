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
