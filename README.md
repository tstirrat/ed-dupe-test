# Ember Data Embedded hasMany dupe mockup

Submitting a new record inside an Embedded hasMany relationship causes a ghost record in the resulting array upon `save()`. 

One record is the original embedded (unsaved) record, it contains a `null` id. The other is the record given back from the server, it contains an id.

Will eventually adapt this with a `client_id` style fix, but ideally it should be fixed in Ember Data 1.0
