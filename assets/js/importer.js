var App = require("./app/App");

$(document).ready(function() {
    new App.Router();
    Backbone.history.start();
});
