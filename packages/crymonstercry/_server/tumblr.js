/**
 *	Class for fetching and managing blog posts from the Tumblr API
 *	
 *	@class Tumblr
 *	@static
 */

Tumblr = { 

	/**
	 *	Fiber needed for async stuff
	 */
	Fiber: Npm.require('fibers'),

	/**
	 *	Tumblr API endpoint url
	 *
	 *	@property	endpointUrl
	 *	@type		{String}
	 */
	endpointUrl: Meteor.settings.tumblr.apiUrl,

	/**
	 *	Tumblr consumer key
	 *	
	 *	@property	consumerKey
	 *	@type		{String}
	 */
	consumerKey: Meteor.settings.tumblr.consumerKey,

	/**
	 *	The blog post we fetch the content from
	 *
	 *	@property 	blogUrl
	 *	@type		{String}
	 */
	blogUrl: Meteor.settings.tumblr.blogUrl,

	/**
	 *	The blog name, so we can filter posts
	 *
	 *	@property	blogName
	 *	@type {String}
	 */
	blogName: Meteor.settings.tumblr.blogName,

	/**
	 *	Filter parameter for Tumblr content
	 *
	 *	@property 	filterParams
	 *	@type		{Object}
	 */
	filterParams: Meteor.settings.tumblr.filterParams,

	/**
	 *	Interval reference for poll function
	 *
	 *	@property	updatePollInterval
	 *	@type		{Function}
	 *	@default 	false
	 */
	updatePollInterval: false,

	/**
	 *	Function to poll for content updates at an interval
	 *	
	 *	@method 	pollForUpdates
	 *	@return 	undefined - returns nothing;
	 */
	pollForUpdates: function() {

		var self = this;

		/**
		 * 	Set the update to call at a specified interval
		 *	This needs to be run inside a fiber
		 */
		this.Fiber(function() {

			this.updatePollInterval = Meteor.setInterval(function() {
				
				self.refreshPosts().then(function() {
					console.log('Tumblr refreshed: ' + new Date().getTime());
				}).fail(function() {
					/**
					 *	Kill the poll update interval on fail
					 */
					Meteor.clearInterval(self.updatePollInterval);
				});

			}, Meteor.settings.app.pollInterval);

		}).run();
	},

	/**
	 *	Function to publish the collection
	 *	
	 *	@function 	publishContent
	 *	@return 	undefined - returns nothing;
	 */
	publishCollection: function() {
		Meteor.publish('tmblr_posts', function() {
			return Server.collections.tmblr_posts.find({});
		});
	},

	/**
	 *	Function to refresh Tumblr posts via the Tumblr api
	 *
	 *	@method refreshPosts()
	 *	@return {Object} - a resolved or rejected promise
	 */
	refreshPosts: function() {

		var deferred = Q.defer();
			self = this;

		/**
		 *	Grab the Tumblr posts
		 */
		this.posts().then(function(result) {

			self.Fiber(function() {

				if(Helpers.checkNested(result, 'data', 'response', 'posts')) {
					_.each(result.data.response.posts, function(item) {
						if(Helpers.checkNested(item, 'trail', '0')) {

							if(typeof item.trail[0].blog.name !== 'undefined' && item.trail[0].blog.name === self.blogName) {
								Server.collections.tmblr_posts.update({
									id: item.id
								},
								item,
								{
									upsert: true
								});
							}
						}
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
	 *	Function to fetch filtered Tumblr blog posts
	 *
	 *	@method	posts()
	 *	@return {Object} - A promise containing a json object for the returned posts
	 */
	posts: function() {

		var deferred 	= 	Q.defer();
			params 		= 	{
				api_key: this.consumerKey,
				filter:  this.filterParams.posts.filter,
				limit: this.filterParams.posts.limit
			},
			url = this.endpointUrl + '/v2/blog/' + this.blogUrl + '/posts';

		HTTP.call('get', url, {params: params}, function(error, result) {

			if(error) {
				deferred.reject({
					status: 'error',
					data: error
				});
			}
			else {
				deferred.resolve({
					status: 'ok',
					data: EJSON.parse(result.content)
				});
			}

		});

		return deferred.promise;
	}

};