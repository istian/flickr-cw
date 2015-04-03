var App = require("./app/App");

$(document).ready(function () {
  window.FlickrAppRouter = new App.Router();
  Backbone.history.start();
});
