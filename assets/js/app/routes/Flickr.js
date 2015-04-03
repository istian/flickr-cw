var Backbone = require("backbone"),
  MainView = require("../views/Main"),
  PreviewView = require("../views/ViewPhoto");

module.exports = Backbone.Router.extend({

  routes: {
    "view/:id": "View",
    "*paths": "Main"
  },

  Main: function () {
    new MainView();
  },

  View: function (id) {
    new PreviewView();
    Backbone.trigger("Flickr:Photos:Select_Img", {id: id});
  }

});
