/**
 * FlickerController
 *
 * @description :: Server-side logic for managing Flickers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Flickr = require("node-flickr"),
  _ = require("lodash"),
  util = require("util");

var flickr = new Flickr({
  api_key: process.env.FLICKR_KEY
});

function getImage(sizes, size) {
  return _.pluck(_.filter(sizes, {label: size}), "source")[0];
}

function constructUrl(data) {
  //http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
  return util.format(
    "http://farm%d.staticflickr.com/%d/%d_%s_z.jpg",
    data.farm,
    data.server,
    data.id,
    data.secret
  );
}

module.exports = {

  photos: function (req, res) {

    var p = encodeURIComponent(req.param("q").trim()),
      params = {
        text: p,
        page: parseInt(req.param("page")) || 1,
        per_page: 10,
        extras: "description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_t, url_m"
      };

    var cacheKey = Cache.genKey(JSON.stringify(params));

    Cache.get(cacheKey, function (err, result) {
      if (err) {
        return res.serverError({error: true, message: "Server encountered an error. Please try again later"});
      }

      if (!result) {
        flickr.get("photos.search", params, function (response) {
          if (response.stat != 'ok') {
            return res.badRequest({error: true, message: "Unable to fetch photos. Please try again later."});
          } else {
            Cache.save(cacheKey, response, 1880, null, function (err, data) {
              if (err) {
                return res.serverError({error: true, message: "Unable to cache data"});
              }

              return res.json(response);
            });
          }

        });

      } else {
        return res.json(result);
      }


    });
  },

  getInfo: function (req, res) {
    var p = encodeURI(req.param("id")),
      params = {
        photo_id: p
      };


    var cacheKey = Cache.genKey(JSON.stringify(params));

    Cache.get(cacheKey, function (err, result) {
        if (err) return res.serverError({error: true, message: "Oops! Server encountered an error!"});

        if (!result) {
          flickr.get("photos.getInfo", params, function (response) {
              if (response.stat != "ok") return res.json(404, {error: true, message: "Image not found"});

              Cache.save(cacheKey, response, 1000, null, function (err, data) {
                if (err) return res.serverError("Oop! Server encountered an error");

                var data = response.photo || {};

                return res.json({
                  title: "",
                  description: "",
                  thumbnail_url: "",
                  preview_url: constructUrl(data),
                  views: "",
                  type: "",
                  uploaded_at: ""
                });
              });
            }
          );
        }
        else {
          var data = result.photo || {};

          return res.json({
            title: "",
            description: "",
            views: "",
            type: "",
            uploaded_at: "",
            thumbnail_url: "",
            preview_url: constructUrl(data)
          });
        }

      }
    )
    ;

  }

}
;

