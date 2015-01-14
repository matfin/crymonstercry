/**
 *	Class for curating data fetched from external sources and populating 
 *	it into server side Meteor collections and publishing those.
 *	
 *	@class Server
 *	@static
 */

var Fiber = Npm.require('fibers');

Server = {

	/**
	 *	The Mongo Collections for storing fetched data.
	 *
	 *	@property	collections
	 *	@typpe		{Object}
	 */
	collections: {
		cf_releases: new Mongo.Collection('cf_releases'),
		cf_assets: new Mongo.Collection('cf_assets'),
		cf_entries: new Mongo.Collection('cf_entries'),
		cf_gigs: new Mongo.Collection('cf_gigs')
	},

	/**
	 *	Function to populate gigs from the contentful endpoint
	 *	
	 *	@method populateCFGigs()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateCFGigs: function() {
		var deferred = Q.defer(),
			self = this;

		Contentful.gigs().then(function(result) {

			_.each(result.data.collections, function(collection) {

				/**
				 *	Calling Meteor to insert to and remove from a Collection
				 *	requires the use of a fiber
				 */
				Fiber(function() {

					/**
					 * Clear out old data.
					 */
					self.collections[collection.name].remove({});

					/**
					 *	Then populate new data
					 */
					_.each(collection.items, function(item) {
						self.collections[collection.name].insert(item);
					});

					Meteor.publish(collection.name, function() {
						return self.collections[collection.name].find({});
					});

				}).run();

			});

			deferred.resolve();

		}).fail(function(error) {

			deferred.reject(error);

		});

		return deferred.promise;
	},

	/**
	 *	Function to populate releases from the contentful endpoint
	 *
	 *	@method populateCFReleases()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateCFReleases: function() {

		var deferred = Q.defer(),
			self = Server;

		Contentful.releases().then(function(result) {
		
			_.each(result.data.collections, function(collection) {
				/**
				 *	Calling Meteor to insert to and remove from a Collection
				 *	requires the use of a fiber
				 */
				Fiber(function() {
					
					/**
					 *	Clear out the old data on reboot
					 *	@TODO: This is inefficent, use upsert
					 */
					self.collections[collection.name].remove({});

					/**
					 *	Go through each group of returned items
					 *	and insert them to the correct collections.
					 */
					_.each(collection.items, function(item) {
						self.collections[collection.name].insert(item);
					});

					/**
					 *	Then we publish the collection so the client side
					 *	MiniMongo instance can access it.
					 */
					Meteor.publish(collection.name, function() {
						return self.collections[collection.name].find({});
					});

				}).run();
			});

			deferred.resolve();

		}).fail(function(error) {
			
			deferred.reject(error);

		});
	
		return deferred.promise;
	}

}