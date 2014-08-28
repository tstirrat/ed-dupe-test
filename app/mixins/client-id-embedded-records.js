import Ember from 'ember';
import DS from 'ember-data';

var camelize = Ember.String.camelize;

export default Ember.Mixin.create(DS.EmbeddedRecordsMixin, {
  init: function () {
    this.clientIdMap = {};
    this._super();
  },

  clientIdKey: '_client_id',

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

  extractSingle: function(store, primaryType, payload, recordId) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partial = payload[root];
    this.updateIdsFromClientIds(primaryType, partial);
    return this._super(store, primaryType, payload, recordId);
  },

  extractArray: function(store, primaryType, payload) {
    var root = this.keyForAttribute(primaryType.typeKey),
        partials = payload[Ember.String.pluralize(root)];

    Ember.EnumerableUtils.forEach(partials, function(partial) {
      this.updateIdsFromClientIds(primaryType, partial);
    }, this);

    return this._super(store, primaryType, payload);
  },

  updateIdsFromClientIds: function (type, hash) {
    type.eachRelationship(function (key, relationship) {
      if (this.hasDeserializeRecordsOption(key)) {
        var records = hash[key];
        if (relationship.kind === 'belongsTo' && records) {
          records = [records];
        }
        if (!records) { return; }
        Ember.EnumerableUtils.forEach(records, function (recordHash) {
          var clientId = recordHash[this.clientIdKey];
          if (clientId && recordHash.id) {
            var typeSerializer = this.store.serializerFor(relationship.type);
            var record = typeSerializer.clientIdToRecord(clientId);
            if (record) {
              this.store.updateId(record, recordHash);

              // TODO: hack is necessary to keep ED states in tact
              record.adapterWillCommit();
              this.store.didSaveRecord(record, recordHash);
              // TODO: end hack

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
      json[this.clientIdKey] = clientId;
    }

    return json;
  },

  // checks config for attrs option to embedded (always) - serialize and deserialize
  hasEmbeddedAlwaysOption: function (attr) {
    var option = this.attrsOption(attr);
    return option && option.embedded === 'always';
  },

  // checks config for attrs option to deserialize records
  // a defined option object for a resource is treated the same as
  // `deserialize: 'records'`
  hasDeserializeRecordsOption: function(attr) {
    var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
    var option = this.attrsOption(attr);
    return alwaysEmbed || (option && option.deserialize === 'records');
  },

  attrsOption: function(attr) {
    var attrs = this.get('attrs');
    return attrs && (attrs[camelize(attr)] || attrs[attr]);
  }
});
