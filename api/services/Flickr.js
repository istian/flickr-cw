module.exports = {
  init: function(cb) {
    var Flickr = require("flickrapi");
    /*this.flickr = new Flickr({
      api_key: sails.config.flickr.key,
      secret: sails.config.flickr.secret
    });*/

    Flickr.tokenOnly({
      api_key: process.env.FLICKR_KEY,
      secret: process.env.FLICKR_SECRET
    }, function(err, flickr) {
      cb(err, flickr);
    })
  }
}
