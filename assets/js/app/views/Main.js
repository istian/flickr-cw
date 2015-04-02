var _ = require("lodash"),
  Backbone = require("backbone");

var PhotosView = require("./Photos.js");

module.exports = Backbone.View.extend({

  el: "#FlickrPhotoSearchApp",

  initialize: function () {
    this.q = this.$('#q');
    this.Photos = new PhotosView();
  },

  events: {
    'keypress #q': "searchOnEnterKey"
  },

  searchOnEnterKey: _.debounce(function (e) {
    if (e.keyCode !== 13) return;
    if (!this.q.val()) return;

    Backbone.trigger("Flickr:Photos:Search", {q: this.q.val()});
  }, 400)

});
