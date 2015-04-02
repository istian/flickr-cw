var Backbone = require("backbone"),
  _ = require("lodash"),
  PhotoModel = require("../models/Photo");

module.exports = Backbone.Collection.extend({

  url: "/search",

  model: PhotoModel,

  parse: function (response) {
    var self = this;

    if (response.stat !== "ok") return false;

    var photos = response.photos.photo,
      i = {};

    self.total_rows = response.photos.total;
    self.current_page = response.photos.page;
    self.total_pages = response.photos.pages;
    self.per_page = response.photos.perpage;


    $.each(photos, function (index, value) {
      i = photos[index];
      self.push({
        title: i.title,
        thumbnail_url: i.url_t,
        preview_url: i.url_m,
        uploaded_at: i.dateupload,
        type: i.media,
        views: i.views
      });
    });

    return this.models;
  }

});
