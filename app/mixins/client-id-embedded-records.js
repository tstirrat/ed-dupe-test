import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create(DS.EmbeddedRecordsMixin, {
  init: function () {
    this.clientIdMap = {};
    this._super();
  },

  /**
    Return a unique client id

    @property createClientId
    @type {String}
  */
  createClientId: function (record) {
    var guid = Ember.guidFor(record);

    this.clientIdMap[guid] = record;
    return guid;
  },

  clientIdToRecord: function (clientId) {
    return this.clientIdMap[clientId];
  },

  normalize: function(type, hash, prop) {
    this.updateIdsFromClientIds(type, hash);
    return this._super(type, hash, prop);
  },

  updateIdsFromClientIds: function (type, hash) {
    type.eachRelationship(function (key, relationship) {
      if (this.hasDeserializeRecordsOption(key)) {
        var records = hash[key];
        if (relationship.kind === 'belongsTo') {
          records = [records];
        }
        records.forEach(function (recordHash) {
          var clientId = recordHash['_clientId'];
          if (clientId && recordHash.id) {
            var typeSerializer = this.store.serializerFor(relationship.type);
            var record = typeSerializer.clientIdToRecord(clientId);
            if (record) {
              this.store.updateId(record, recordHash);
              delete typeSerializer.clientIdMap[clientId];
            }
          }
        }, this);
      }
    }, this);
  },

  serialize: function(record, options) {
    var json = this._super(record, options);

    if (record.get('isNew')) {
      var clientId = this.createClientId(record);
      json['_clientId'] = clientId;
    }

    return json;
  },
});
