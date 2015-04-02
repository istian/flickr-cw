var Backbone = require("backbone");

module.exports = Backbone.View.extend({

  tagName: "li",

  className: "item",

  template: require("../../../templates/flickr/thumbnail.hbs"),

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});
