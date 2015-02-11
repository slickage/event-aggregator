# Meetup test app tokens

- **caveat:** meetup only allows geo-based searching through `open_events`.
- **caveat:** meetup's HTTP API returns XML, not JSON

## Description
trevor's throwaway meetup account

- Key: 1f2239571b3a4d192f505f185b407935

# Useful API query params

## main items

- and_text
  - Changes the interpretation of the "text" field from OR'd terms to AND'd
        terms
- category
  - Return events in the specified category or categories specified by
        commas. This is the category id returned by the Categories method.
- city
  - A valid city
- country
  - A valid country code
- fields
  - Request that additional fields (separated by commas) be included in the
        output
- lat
  - A valid latitude, limits the returned group events to those within radius
        miles
- limited_events
  - Include limited event information for private groups that wish to expose
        only a small amount of information about their events. This includes
        just: id, name, utc_offset, time, duration, yes_rsvp_count,
        waitlist_count, group, visibility, timezone. Value must be true or
        false.
- lon
  - A valid longitude, limits the returned group events to those within radius
        miles
- radius
  - Radius, in miles for geographic requests, default 25.0 -- maximum 100. May
        also be specified as "smart", a dynamic radius based on the number of
        active groups in the area
- state
  - If searching in a country with states, a valid 2 character state code
- status
  - Status may be "upcoming", "past" or both separated by a comma. The default
        is "upcoming" only
- text
  - Events that contain the given term or terms somewhere in their content. The
        terms are OR'd by default. Separate terms with " AND " for events that
        have combined terms. To have terms automatically AND'd, set the
        "and_text" to true
- text_format
  - Format of the description text, "html" or "plain". Defaults to "html"
- time
  - Return events scheduled within the given time range, defined by two times
        separated with a single comma. Each end of the range may be specified
        with relative dates, such as "1m" for one month from now, or by absolute
        time in milliseconds since the epoch. If an endpoint is omitted, the
        range is unbounded on that end. The default value is unbounded on both
        ends (though restricted to the search window described above). Note: to
        retrieve past events you must also update status value
- topic
  - Return events in the specified topic or topics specified by commas. This is
        the topic "urlkey" returned by the Topics method. If all supplied topics
        are unknown, a 400 error response is returned with the code "badtopic".
- zip
  - A valid US zip code, limits the returned groups to those within radius miles


## Ordering

- distance
  - ordering is approximate and will not exactly match the values in the
        "distance" field.
- time
  - (default order) ascending
- trending
  - you will likely want to specify "desc=true" to get the best trending results
        first.
