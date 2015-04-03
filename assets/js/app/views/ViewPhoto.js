var Backbone = require("backbone"),
  PhotoModel = require("../models/Photo");

module.exports = Backbone.View.extend({

  el: "#preview",

  template: require("../../../templates/flickr/preview.hbs"),

  initialize: function () {
    console.log("view photo");
    this.listenTo(Backbone, "Flickr:Photos:Select_Img", this.renderPreview);

    this.model = new PhotoModel;

  },

  events: {
    "click .btn-close-preview": "closePreview"
  },

  renderPreview: function (data) {
    var self = this;
    self.model.on("fetch", function () {
      Backbone.trigger("Flickr:Photos:Fetching_Img_Info");
    }).fetch({
      data: {
        id: data.id
      },
      success: function () {

      }
    }).error(function () {
    }).success(function (data) {
      Backbone.trigger("Flickr:Photos:Display_Img_Preview", self.model.toJSON());
      var tpl = self.template(self.model.toJSON());

      self.$el
        .empty()
        .append(tpl);

    }).done(function () {
      self.$el.removeClass("hidden");
    });

    return this;
  },

  closePreview: function () {
    Backbone.trigger("Flickr:Photos:Close_Img_Preview");
    window.FlickrAppRouter.navigate("/", {trigger: true, replace: true});
    this.$el.addClass("hidden");
  }

});
