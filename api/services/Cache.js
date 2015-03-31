var crypto = require('crypto' ),
	cm = require('cache-manager' ),
	debug = require('debug')('authorize:CacheService' );

function genKey(key, prefix) {
	var keyPrefix = prefix ? prefix + ':' : '';
	return keyPrefix + crypto.createHash('sha1' ).update(key).digest('hex');
}

function Cache() {
	var self;
	self = this instanceof Cache ? this : Object.create( Cache.prototype );
	self.cache = cm.caching( sails.config.cache );
	return self;
}

Cache.prototype.get = function(key, cb, prefix) {
	var self = this;
	if (!key) return false;
	key = genKey(key, prefix);
	self.cache.get(key, function(err, result) {
		cb(err, result);
	});
}

Cache.prototype.save = function(key, value, ttl, keyPrefix, cb) {
	var self = this;

	key = genKey( key, keyPrefix );

	if (ttl !== undefined) {
		self.ttl = ttl;
	}
	self.cache.set(key, value, self.ttl, function(err, result) {
		if(cb) {
			console.log('Saving cache using key:' + key, result);
			return cb(err, result);
		}

		if (err) debug('error saving cache: ' + key);
	});

	return self;
}

Cache.prototype.delete = function(key) {
	var self = this;
	self.cache.store.delete( genKey( key ), function(err, result) {
		if (!err) debug('Deleting cache with key: ' + key, result);
	});
	return self;
}

Cache.prototype.getClient = function() {
	return this.client;
}

Cache.prototype.flushAll = function(cb) {
	var self = this;
	if (self.cache.store.hasOwnProperty('flushall') && typeof self.cache.store.flushall === 'function') { // usually redis store
		self.cache.store.flushall(function(err, result){
			if(typeof cb === 'function') {
				console.log('Deleting all data from cache store: ', result);
				return cb(err, result);
			}

			console.log('Deleting all data from cache store: ', result);
		});
	} else {
		debug('Cache store has no \'flushall\' method');
	}

	if (self.cache.store.hasOwnProperty('reset') && typeof self.cache.store.reset === 'function') { // usually memory store
		debug('Deleting cache data from memory store.');
		self.cache.store.reset();
	} else {
		debug('Cache store has no \'reset\' method');
	}
	return this;
}

Cache.prototype.genKey = genKey;

module.exports = Cache();
