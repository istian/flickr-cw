var Backbone = require("backbone"),
  MainView = require("../views/Main");

module.exports = Backbone.Router.extend({

  routes: {
    "*paths": "Main"
  },

  Main: function() {
    new MainView();
  }

});
