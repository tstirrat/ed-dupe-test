# Ember Data Embedded hasMany dupe mockup

Submittins a new record inside an Embedded hasMany relationship
causes a ghost record in the array. One for the original embedded
record, which contains a `null` id, the other is the new record
created from the response JSON which was given a server side id.

Will eventually adapt this with a `client_id` style fix, but ideally
it should be fixed in Ember Data 1.0