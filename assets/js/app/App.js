var $ = require("jquery"),
  _ = require("lodash"),
  Backbone = require("backbone"),
  Handlebars = require("hbsfy/runtime"),
  paginate = require('handlebars-paginate'),
  Swag = require("swag"),
  FlickrRouter = require("./routes/Flickr");

Backbone.$ = $;

window.Backbone = Backbone;


Handlebars.registerHelper('paginate', paginate);

Swag.registerHelpers(Handlebars);


var App = function() {
  return {
    Router: FlickrRouter
  };
}

module.exports = App();
