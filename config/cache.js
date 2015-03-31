var debug = require('debug')('cacheConfig:debug');

var redisStore = require('../api/services/CacheStore/redis.js');

module.exports.cache = {
  store: redisStore,
  db: 1,
  host: 'localhost',
  port: 6379,
  ttl: 600, // sec (1 min),
  prefix: 'appCache'
}
