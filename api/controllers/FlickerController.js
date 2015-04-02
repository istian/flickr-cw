/**
 * FlickerController
 *
 * @description :: Server-side logic for managing Flickers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

//var Flickr = require("flickrapi");

var Flickr = require("node-flickr");

var flickr = new Flickr({
  api_key: process.env.FLICKR_KEY
});

var debug = require("debug")("FlickrController:debug");

module.exports = {
  search: function (req, res) {
    /*Flickr.tokenOnly({
     api_key: sails.config.flickr.key,
     secret: sails.config.flickr.secret,
     progress: false
     }, function(err, flickr) {
     debug(err, "the error");
     debug(flickr, "the flickr instance");
     });*/

    //debug(sails.config.flickr.photos.search, "the instance");
    sails.config.flickr.photos.search({
      text: "red+panda"
    }, function (err, result) {
      if (err) res.error(err);

      return res.json({data: result});
    })
  },

  photos: function (req, res) {

    var p = encodeURIComponent(req.param("q").trim()),
      params = {
        text: p,
        page: parseInt(req.param("page")) || 1,
        extras: "description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_t, url_m"
      };

    debug("THE PARAMS", params);

    var cacheKey = Cache.genKey(JSON.stringify(params));

    debug("THE CACHE KEY", cacheKey);

    Cache.get(cacheKey, function (err, result) {
      if (err) {
        return res.serverError({error: true, message: "Server encountered an error. Please try again later"});
      }

      if (!result) {
        flickr.get("photos.search", params, function (response) {
          if (response.stat != 'ok') {
            debug('No cache data error condition', response);
            return res.badRequest({error: true, message: "Unable to fetch photos. Please try again later."});
          } else {
            debug("IT WHEN TO SAVING OF CACHE");
            Cache.save(cacheKey, response, 1880, null, function (err, data) {
              if (err) {
                debug("THE CACHE ERROR SAVING", err);
                return res.serverError({error: true, message: "Unable to cache data"});
              }

              debug("Saving to cache");
              return res.json(response);
            });
          }

        });

      } else {
        debug("Coming from cache");
        return res.json(result);
      }


    });
  }
};

