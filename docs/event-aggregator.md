# main aggregation function

## behavior

1. queries argument `provider` for events, with a callback to form the resulting
   data into a form that matches DB insert spec
   2. default behavior if no `provider` arg is all providers

2. reads in `./config.json` to get:
    3. hnl.io API url
    4. API tokens by provider (key/val pairs)
   
3. POSTs data to API, event by event

## data forming

[Spec](https://github.com/talexand/event-aggregator/wiki/Initial-Spec) requires
following form:

```json
{
  "title": "Event Title",
  "body": "Event description. Long text..."
  "start": {unix time ms}
  "end": {unix time ms}
  "created_at": {unix time ms}
  "updated_at": {unix time ms}
  "imported": {
    "resource_url": "http://eventbrite.com/alsdjflkjasdfkljsad"
    "service": "Eventbrite"
  }
}
```
