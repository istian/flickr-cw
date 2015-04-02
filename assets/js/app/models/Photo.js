var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    title: "",
    thumbnail_url: "",
    preview_url: "",
    type: "",
    views: "",
    uploaded_at: ""
  }
});
