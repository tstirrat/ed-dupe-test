import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    comments: { embedded: 'always' }
  }
});
