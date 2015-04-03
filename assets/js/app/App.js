var $ = require("jquery"),
  _ = require("lodash"),
  Backbone = require("backbone"),
  Handlebars = require("hbsfy/runtime"),
  paginate = require('handlebars-paginate'),
  Swag = require("swag"),
  FlickrRouter = require("./routes/Flickr");

Backbone.$ = $;

/*Path Backbone Model and Collection to listen to fetch event*/
_.each(["Model", "Collection"], function(name) {
  // Cache Backbone constructor.
  var ctor = Backbone[name];
  // Cache original fetch.
  var fetch = ctor.prototype.fetch;

  // Override the fetch method to emit a fetch event.
  ctor.prototype.fetch = function() {
    // Trigger the fetch event on the instance.
    this.trigger("fetch", this);

    // Pass through to original fetch.
    return fetch.apply(this, arguments);
  };
});

window.Backbone = Backbone;

Handlebars.registerHelper('paginate', paginate);

Handlebars.registerHelper('json', function(obj) {
  return JSON.stringify(obj);
});

Swag.registerHelpers(Handlebars);


var App = function() {
  return {
    Router: FlickrRouter
  };
}

module.exports = App();
