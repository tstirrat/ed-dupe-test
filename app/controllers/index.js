import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    go: function () {
      var c = this.store.createRecord('comment', { body: 'comment 2' });
      this.get('model.comments').pushObject(c);
      this.get('model').save();
    }
  }
});