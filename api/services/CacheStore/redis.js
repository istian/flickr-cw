/**
 * This is a very basic example of how you can implement your own Redis-based
 * cache store with connection pooling.
 */

var RedisPool = require('sol-redis-pool' ),
	debug = require('debug')('RedisStore:debug');

function redis(args) {
	args = args || {};
	var self = {};
	var ttlDefault = args.ttl;
	self.name = 'redis';

	var redis_options = {
		host: args.host || '127.0.0.1',
		port: args.port || 6379
	};

	var pool = new RedisPool(redis_options, {});

	function connect(cb) {
		pool.acquire(function (err, conn) {
			if (err) {
				pool.release(conn);
				return cb(err);
			}

			if (args.db || args.db === 0) {
				conn.select(args.db);
			}

			cb(null, conn);
		});
	}

	self.get = function (key, cb) {
		if (args['prefix']) {
			key = args['prefix'] + ':' + key;
		}
		connect(function (err, conn) {
			if (err) { return cb(err); }

			conn.get(key, function (err, result) {
				pool.release(conn);
				if (err) { return cb(err); }
				cb(null, JSON.parse(result));
			});
		});
	};

	self.set = function (key, value, ttl, cb) {
		var ttlToUse = ttl || ttlDefault;
		if (args['prefix']) {
			key = args['prefix'] + ':' + key;
		}
		connect(function (err, conn) {
			if (err) { return cb(err); }

			if (ttlToUse) {
				conn.setex(key, ttlToUse, JSON.stringify(value), function (err, result) {
					pool.release(conn);
					cb(err, result);
				});
			} else {
				conn.set(key, JSON.stringify(value), function (err, result) {
					pool.release(conn);
					cb(err, result);
				});
			}
		});
	};

	self.delete = function (key, cb) {
		if (args['prefix']) {
			key = args['prefix'] + ':' + key;
		}
		connect(function (err, conn) {
			if (err) { return cb(err); }

			conn.del(key, function (err, result) {
				pool.release(conn);
				cb(err, result);
			});
		});
	};

	self.keys = function (pattern, cb) {
		if (typeof pattern === 'function') {
			cb = pattern;
			pattern = '*';
		}

		connect(function (err, conn) {
			if (err) { return cb(err); }

			conn.keys(pattern, function (err, result) {
				pool.release(conn);
				cb(err, result);
			});
		});
	};

	self.flushall = function(cb) {
		connect(function(err, conn) {
			if (err) { return cb(err) }
			conn.flushall(function(err, result) {
				pool.release(conn);
				cb(err, result);
			})
		})
	}

	return self;
}

module.exports = {
	create: function (args) {
		return redis(args);
	}
};
