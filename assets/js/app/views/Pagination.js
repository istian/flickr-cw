var _ = require("lodash"),
  Backbone = require("backbone"),
  $ = require("jquery");

module.exports = Backbone.View.extend({

  el: "#wrapPagination",

  template: require("../../../templates/flickr/pagination.hbs"),

  initialize: function () {
    this.listenTo(Backbone, "Flickr:Photos:Search_Success", this.render);
  },

  events: {
    "click .pagination a": "fetch"
  },

  render: function (arg) {
    var _this = this,
      tplVars = {
        pagination: {
          page: arg.photos.page,
          pageCount: arg.photos.pages
        }
      },
      tpl = _this.template(tplVars);

    _this.q = arg.q || "";

    _this.$el.empty().append(tpl);
    return _this;
  },

  fetch: function (e) {
    var a = $(e)[0].currentTarget,
      page = $(a).data('page');

    e.preventDefault();

    Backbone.trigger("Flickr:Photos:NavigatePages", {page: page, q: this.q});
  }

});
