/**
 *	Class for fetching and managing content from Instagram
 *	
 *	@class Instagram
 *	@static
 */
Instagram = {

	/**
	 *	Fiber needed for async stuff
	 */
	Fiber: Npm.require('fibers'),

	/**
	 *	The Instagram API url
	 *
	 *	@property	apiUrl
	 *	@type 		{String}
	 */
	apiUrl: Meteor.settings.instagram.apiUrl,

	/**
	 *	The Instagram client ID  
	 *
	 *	@property	clientID
	 *	@type 		{String}
	 */
	clientID: Meteor.settings.instagram.clientID,

	/**
	 *	Instagram userId - needed to access recent posts
	 *
	 *	@property 	username
	 *	@type 		{String}
	 */
	userId: Meteor.settings.instagram.userId,


	/**
	 *	Function to kick off fetching of Instagram posts
	 *
	 *	@method populateContent
	 *	@return {Object} - a resoved or rejected promise
	 */
	populateContent: function() {

		var deferred = Q.defer(),
			self = this;

		this.getRecentMedia().then(function(result) {

			/**
			 *	Populate the collection from within a Fiber
			 */
			self.Fiber(function() {

				/**
				 *	Clear out the old collection data
				 */
				Server.collections.in_images.remove({});

				/**
				 *	Then refresh it, publishing the collections
				 */
				_.each(result.data.data, function(item) {
					Server.collections.in_images.insert(item);
				});

				Meteor.publish('in_images', function() {
					return Server.collections.in_images.find({});
				});

			}).run();

			deferred.resolve();

		}).fail(function(error) {
			
			deferred.reject();

		});

		return deferred.promise;
	},

	/**
	 * 	Function to grab the users most recent media
	 *
	 *	@method		getRecentMedia()
	 *	@return		A resolved promise with json data for the recent uploads, or a rejected promise
	 */
	getRecentMedia: function() {

		var deferred = Q.defer(),
			data = {
				client_id: this.clientID,
				count: 20,
			},
			url = this.apiUrl + '/v1/users/' + this.userId + '/media/recent/';

		HTTP.call('get', url, {params: data}, function(error, result) {
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



