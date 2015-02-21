# Eventbrite test app tokens

## Description 
Event Search Test
	
- Key: HEURTPEMT2UVES6RTO	
- Client secret: XXYHV5HQKH6UISBXHSTPHZTS2FR4XG2ACGF3TZI3IOFN7ADCBT
- Your personal OAuth token: 3YUUGCNZ3FWXKNWSWMKY
- Anonymous access OAuth token: 5OTKXGRDYWFRA2SWONXT 

# Useful API query params

- `location.address` The address of the location that you want to search around.
- `location.latitude` The latitude of the location that you want to search
  around.
- `location.longitude` The longitude of the location that you want to search
  around.
- `location.within` The distance that you want to search around the given
  location. This should be an integer followed by “mi” or “km”.
- `venue.city` Only return events that are located in the given city.
- `organizer.id` Only return events that are organized by a specific Organizer.
- `user.id` Only return events that are organized by a specific User.
- `tracking_code` Append the given tracking_code to the event URLs that are
  returned.
- `categories` Only return events that are in a specific category — must pass
  in the category ID, not the name. To pass in multiple categories, list with a
  comma separator.
- `start_date.range_start` Only return events with start dates after the given
  UTC date.
- `start_date.range_end` Only return events with start dates before the given
  UTC date.
- `start_date.keyword` Only return events with start dates within the given
  keyword date range. Valid options are “today”, “tomorrow”, “this_week”,
  “this_weekend”, “next_week”, and “this_month”.
