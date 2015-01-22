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

		this.updatePollInterval = Meteor.setTimeout(function() {
			
			self.refreshContent().then(function() {
				console.log('Content refreshed: ' + new Date().getTime());
			}).fail(function(){
				/**
				 *	Kill the poll update interval on fail
				 */
				Meteor.clearTimrout(self.updatePollInterval);
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
		Meteor.publish('in_images', function() {
			return Server.collections.in_images.find({});
		});
	},

	/**
	 *	Function to kick off fetching of Instagram posts
	 *
	 *	@method refreshContent
	 *	@return {Object} - a resoved or rejected promise
	 */
	refreshContent: function() {

		var deferred = Q.defer(),
			self = this;

		this.getRecentMedia().then(function(result) {
			/**
			 *	Populate the collection from within a Fiber
			 */
			self.Fiber(function() {

				/**
				 *	Call an upsert to check for and add new content
				 */
				_.each(result.data.data, function(item) {

					Server.collections.in_images.update(
						{
							id: item.id
						},
						item,
						{
							upsert: true
						}
					);
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



