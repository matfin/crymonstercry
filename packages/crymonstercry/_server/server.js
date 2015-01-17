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
		/**
		 *	Contentful collections
		 */
		cf_releases: new Mongo.Collection('cf_releases'),
		cf_assets: new Mongo.Collection('cf_assets'),
		cf_entries: new Mongo.Collection('cf_entries'),
		cf_gigs: new Mongo.Collection('cf_gigs'),

		/**
		 *	Youtube videos collection
		 */
		yt_videos: new Mongo.Collection('yt_videos'),

		/**
		 *	Tumblr posts collection
		 */
		tmblr_posts: new Mongo.Collection('tmblr_posts')
	},

	/**
	 *	Function to populate Tumblr posts via the Tumblr api
	 *
	 *	@method populateTumblrPosts()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateTumblrPosts: function() {

		var deferred = Q.defer();
			self = this;

		/**
		 *	Grab the Tumblr posts
		 */
		Tumblr.posts().then(function(result) {

			Fiber(function() {
				self.collections.tmblr_posts.remove({});

				if(Helpers.checkNested(result, 'data', 'response', 'posts')) {

					_.each(result.data.response.posts, function(item) {
						self.collections.tmblr_posts.insert(item);
					});

					/**
			    	 *	Then we publish the collection so the client collection 
			    	 *	can access it
			    	 */
			    	Meteor.publish('tmblr_posts', function() {
						return self.collections.tmblr_posts.find({});
					});
				}
				else {	
					deferred.reject();
				}

			}).run();

			deferred.resolve();

		}).fail(function() {

			deferred.reject();

		});

		return deferred.promise;
	},

	/**
	 *	Function to populate YouTube videos from the YouTube api
	 *	
	 *	@method populateYoutubeVideos()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateYoutubeVideos: function() {

		var deferred = Q.defer(),
			self = this;

		/**
		 *	This series of chained promises takes care of the following
		 *
		 *	1) 	Given the youtube username, it fetches the channel
		 *	2) 	Then, with the channels channel id it fetches a list of videos
		 *	3) 	Then with the video ids, it connects to the api passing in each
		 *		video Id and grabs the video data, pushing it into the YouTube
		 *		collection. 
		 *
		 *	Why the binding? Without it, inside each chained function, the scope 
		 *	of 'this' points to the nodejs object and not our YouTube object.
		 */

		Youtube.channel().then(Youtube.videoIds.bind(Youtube))
		.then(Youtube.videos.bind(Youtube))
	    .then(function(result) {
	    	/**
	    	 *	Any code that inserts to Meteor Mongo Collections
	    	 *	needs to be run inside a Fiber.
	    	 */
	    	Fiber(function() {

	    		/**
	    	 	 *	Clear out the old collection
	    	 	 */
	    		self.collections.yt_videos.remove({});

		    	/**
		    	 *	We have the videos, so lets add them to the collection
		    	 */
		    	if(typeof result.data !== 'undefined' && result.data.items !== 'undefined') {
		    		_.each(result.data.items, function(item) {
		    			self.collections.yt_videos.insert(item);
		    		});

		    		/**
			    	 *	Then we publish the collection so the client collection 
			    	 *	can access it
			    	 */
			    	Meteor.publish('yt_videos', function() {
						return self.collections.yt_videos.find({});
					});
		    	}
		    	else {
		    		deferred.reject();
		    	}

	    	}).run();
	   		
	   		deferred.resolve();
	   	})
	   	.fail(function(error) {
	   		deferred.reject({
	   			status: 'error',
	   			data: error
	   		});
	   	});

		return deferred.promise;
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