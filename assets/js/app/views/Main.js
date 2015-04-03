var _ = require("lodash"),
  Backbone = require("backbone");

var PhotosView = require("./Photos.js");

module.exports = Backbone.View.extend({

  el: "#FlickrPhotoSearchApp",

  initialize: function () {
    this.q = this.$('#q');
    this.qSpinner = this.$(".q-spinner");
    this.lSpinner = this.$(".l-spinner");
    this.qClear = this.$(".btn-clear-search");
    this.pagination = this.$("#wrapPagination");
    this.listings = this.$("#listings");
    this.Photos = new PhotosView();

    this.listenTo(Backbone, "Flickr:Photos:Search_Progress", this.UI_progress);
    this.listenTo(Backbone, "Flickr:Photos:Render_Result", this.UI_respond);
    this.listenTo(Backbone, "Flickr:Photos:Display_Img_Preview", this.hideListing);
    this.listenTo(Backbone, "Flickr:Photos:Close_Img_Preview", this.showListing);

  },

  events: {
    'keypress #q': "searchOnEnterKey",
    'click .btn-clear-search': "clearSearchField"
  },

  searchOnEnterKey: _.debounce(function (e) {
    if (e.keyCode !== 13) return;
    if (!this.q.val()) {
      this.qClear.addClass("hidden");
      return;
    };

    Backbone.trigger("Flickr:Photos:Search", {q: this.q.val()});
  }, 400),

  UI_progress: function(arg) {
    if (!arg.q) return;

    this.qSpinner.removeClass("hidden");
    this.qClear.addClass("hidden");

  },

  UI_respond: function(arg) {
    this.qSpinner.addClass("hidden");
    this.qClear.removeClass("hidden");
  },

  hideListing: function() {
    this.listings.addClass("hidden");
    this.pagination.addClass("hidden");
  },

  showListing: function() {
    this.listings.removeClass("hidden");
    this.pagination.removeClass("hidden");
  },

  clearSearchField: function() {
    this.q.val("");
    this.qClear.addClass("hidden");
    this.pagination.empty();
    this.listings.empty();
  }

});
