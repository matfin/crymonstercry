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
	 *	Filter parameter for Tumblr content
	 *
	 *	@property 	filterParams
	 *	@type		{Object}
	 */
	filterParams: Meteor.settings.tumblr.filterParams,


	/**
	 *	Function to populate Tumblr posts via the Tumblr api
	 *
	 *	@method populatePosts()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populatePosts: function() {

		var deferred = Q.defer();
			self = this;

		/**
		 *	Grab the Tumblr posts
		 */
		this.posts().then(function(result) {

			self.Fiber(function() {

				Server.collections.tmblr_posts.remove({});

				if(Helpers.checkNested(result, 'data', 'response', 'posts')) {

					_.each(result.data.response.posts, function(item) {
						Server.collections.tmblr_posts.insert(item);
					});

					/**
			    	 *	Then we publish the collection so the client collection 
			    	 *	can access it
			    	 */
			    	Meteor.publish('tmblr_posts', function() {
						return Server.collections.tmblr_posts.find({});
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
			params 		= 	_.map(this.filterParams.posts, function(item, key) {
								return key + '=' + item
							}).join('&'),
			url 		=	this.endpointUrl + '/v2/blog/' + this.blogUrl + '/posts?api_key=' + this.consumerKey + '&' + params;


		/**
		 *	Run this inside a Fiber
		 */
		//Fiber(function() {

		HTTP.call('get', url, function(error, result) {

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

		//}).run();

		return deferred.promise;
	}

};