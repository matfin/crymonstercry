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
	 *	Result queue, where fetched results are stored 
	 *	
	 *	@property	resultQueue
	 *	@type	{Array}
	 *	@default empty array
	 */
	resultQueue: new Array(),

	/**
	 *	Promise, to be resolved when all remote fetches have been completed
	 *
	 *	@property deferred
	 *	@type {Object}
	 *	@default null
	 */
	deferred: null,

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
				
				self.refreshContent().then(function() {
					console.log('Instagram refreshed: ' + new Date().getTime());
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

		self.deferred = Q.defer();

		this.getRecentMedia().then(function(result) {
		
			/**
			 *	Loop through the result queue in a fiber
			 */
			self.Fiber(function() {
				/**
				 *	Then go through each item, upserting it to the DB
				 */
				_.each(self.resultQueue, function(result){

					_.each(result.data, function(item) {
						Server.collections.in_images.update({
							id: item.id
						}, 
						item,
						{
							upsert: true
						});
					});

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
	 *	@param 		{String} url - optional url passed and used to fetch media
	 *	@return		A resolved promise with json data for the recent uploads, or a rejected promise
	 */
	getRecentMedia: function(url) {

		var self = this,
			data = {
				client_id: this.clientID,
				count: 20,
			},
			initial_url = this.apiUrl + '/v1/users/' + this.userId + '/media/recent/';
			fetch_url = (typeof url !== 'undefined') ? url:initial_url;

		HTTP.call('get', fetch_url, {params: data}, function(error, result) {

			if(error) {
				self.deferred.reject({
					status: 'error',
					data: error
				});
			}
			else {
				/**
				 *	Grab our data from the result
				 */
				var data = EJSON.parse(result.content),
						next_url;

				/**
				 *	Push this onto the result queue
				 */
				self.resultQueue.push(data);

				/**
				 *	Check to see if we have a new url to fetch paginated data from.
				 */
				if(typeof data.pagination !== 'undefined' && typeof data.pagination.next_url !== 'undefined') {
					next_url = data.pagination.next_url;


					console.log('Fetch again from url: ' + next_url);

					/**
					 *	Then use the next url parameter from the fetched data to do this all again,
					 *	bumping newly fetched and paginated data to the result queue
					 */
					self.getRecentMedia(next_url);
				}
				else {

					console.log('Fetch finished and ready to resolve');

					self.deferred.resolve({
						status: 'ok',
						message: 'All data fetched'
					});
				}
			}
		});

		return self.deferred.promise;
	}
};



