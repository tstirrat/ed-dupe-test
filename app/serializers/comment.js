import DS from 'ember-data';
import ClientIdEmbeddedRecordsMixin from '../mixins/client-id-embedded-records';

export default DS.ActiveModelSerializer.extend(ClientIdEmbeddedRecordsMixin, {
});
