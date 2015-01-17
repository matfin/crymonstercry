/**
 *	Class for fetching and managing blog posts from the Tumblr API
 *	
 *	@class Tumblr
 *	@static
 */

var Fiber = Npm.require('fibers');

Tumblr = { 

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
		Fiber(function() {

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

		}).run();

		return deferred.promise;
	}

};

/**
 * 
 *	api.tumblr.com/v2/blog/crymonstercry.tumblr.com/posts?api_key=0moHkznS646WKq3ADmxhRwWYzO09JIh0GHosyjTllTIBmXy2bz&type=text&filter=html
 */