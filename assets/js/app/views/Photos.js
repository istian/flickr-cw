var Backbone = require("backbone"),
  PhotoView = require("./Photo"),
  PaginationView = require("./Pagination"),
  PhotoCollections = require("../collections/Photos"),
  $ = require("jquery"),
  _ = require("lodash"),
  Masonry = require("masonry-layout"),
  imageLoaded = require("imagesloaded");

var Photos = new PhotoCollections;

module.exports = Backbone.View.extend({

  el: "#listings",

  template: require("../../../templates/flickr/listings.hbs"),

  initialize: function () {
    this.listenTo(Backbone, "Flickr:Photos:Search", this.searchPhoto);
    this.listenTo(Backbone, "Flickr:Photos:NavigatePages", this.searchPhoto);
    this.listenTo(Backbone, "Flickr:Photos:Render_Result", this.render);

    this.listenTo(Photos, "add", this.addPhoto);

    this.pagination = new PaginationView();

    this.photoView = [];

  },

  addPhoto: function (photo) {
    this.photoView.push(new PhotoView({model: photo}));
    return this;
  },

  render: function () {
    var self = this,
      container = document.createDocumentFragment();

    _.each(this.photoView, function (sub) {
      container.appendChild(sub.render().el);
    });

    self.$el
      .empty()
      .append(container);

    var msnry = new Masonry(self.el, {
      columnWidth: 60
    });

    imageLoaded(self.el, function () {
      msnry.layout();
    });

  },

  searchPhoto: function (arg) {
    var self = this;
    this.photoView = [];

    Photos.on("fetch", function () {
      Backbone.trigger("Flickr:Photos:Search_Progress", arg);
      self.$el.hide();
    }).fetch({
      data: $.param(arg)
    }).error(function () {
      Backbone.trigger("Flickr:Photos:Search_Error", arg);
    }).success(function (data) {
      Backbone.trigger("Flickr:Photos:Search_Success", _.merge(arg, data));
    }).done(function (data) {
      Backbone.trigger("Flickr:Photos:Render_Result", _.merge(arg, data));
      self.$el.show();
    });
  }

});
