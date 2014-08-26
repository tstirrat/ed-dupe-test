import Ember from 'ember';

export default Ember.ObjectController.extend({

  commentIndex: 1,

  actions: {
    go: function () {
      this.incrementProperty('commentIndex');
      var c = this.store.createRecord('comment', { body: 'comment ' + this.get('commentIndex') });
      this.get('model.comments').pushObject(c);
      this.get('model').save();
    }
  }
});
