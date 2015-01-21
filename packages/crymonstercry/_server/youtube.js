/**
 *	Class for fetching and managing videos fetched from the YouTube API v3
 *	
 *	@class Youtube
 *	@static
 */
Youtube = {

	/**
	 *	Fiber needed for async stuff
	 */
	Fiber: Npm.require('fibers'),

	/**
	 *	The endpoint url of the YouTube data api
	 *
	 *	@property	endpointUrl
	 *	@type		{String}
	 */
	endpointUrl: Meteor.settings.youtube.endpointUrl,

	/**
	 *	The YouTube api key for making requests
	 *
	 *	@property	apiKey
	 *	@type		{String}
	 */
	apiKey: Meteor.settings.youtube.apiKey,

	/**
	 *	The YouTube username for fetching videos
	 *
	 *	@property	channelUser
	 *	@type		{String}
	 */
	channelUser: Meteor.settings.youtube.channelUser,


	/**
	 *	Function to populate YouTube videos from the YouTube api
	 *	
	 *	@method populateeVideos()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateVideos: function() {

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
		this.channel().then(this.videoIds.bind(this))
		.then(this.videos.bind(this))
	    .then(function(result) {
	    	/**
	    	 *	Any code that inserts to Meteor Mongo Collections
	    	 *	needs to be run inside a Fiber.
	    	 */
	    	self.Fiber(function() {

	    		/**
	    	 	 *	Clear out the old collection
	    	 	 */
	    		Server.collections.yt_videos.remove({});

		    	/**
		    	 *	We have the videos, so lets add them to the collection
		    	 */
		    	if(typeof result.data !== 'undefined' && result.data.items !== 'undefined') {
		    		_.each(result.data.items, function(item) {
		    			Server.collections.yt_videos.insert(item);
		    		});

		    		/**
			    	 *	Then we publish the collection so the client collection 
			    	 *	can access it
			    	 */
			    	Meteor.publish('yt_videos', function() {
						return Server.collections.yt_videos.find({});
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
	 *	Function to fetch the channel id given the username
	 *	
	 *	@method channel()
	 *	@return {Object} - A promise containing a json object for the channel returned from youtube
	 */
	channel: function() {

		var deferred 	= 	Q.defer(),
			params 		= 	'part=contentDetails&forUsername=' + 
							this.channelUser + 
							'&key=' + 
							this.apiKey,

			url 		= 	this.endpointUrl + '/channels?' + params;

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
					data: result
				});
			}
		});

		return deferred.promise;
	},

	/**
	 *	Function to fetch basic video data given the channelId.
	 *	This function is part of a chained series of promise functions.
	 *
	 *	@method videoIds()
	 *	@param 	channel - a json object representing a channel
	 *	@return {Object} - a promise containing a json object with video ids
	 */
	videoIds: function(channel) {

		var deferred = Q.defer(),
			self = this,
			channelData = EJSON.parse(channel.data.content);

		/**
		 *	Meteor requires functions like this to be run inside a fiber
		 */
		self.Fiber(function() {

			if(typeof channelData !== 'undefined' && typeof channelData.items !== 'undefined' && channelData.items[0] !== 'undefined') {

				var channelId = channelData.items[0].id,
					params 	  =	'key=' + self.apiKey +
								'&part=snippet,id&order=date' + 
								'&channelId=' + channelId,
					url 	  =	self.endpointUrl + '/search?' + params; 

				HTTP.call('GET', url, function(error, result) {
					if(error) {
						deferred.reject({
							status: 'error',
							data: error
						});
					}
					else {
						deferred.resolve({
							status: 'ok',
							data: result
						});
					}
				});
			}
			else {
				deferred.reject({
					status: 'error',
					data: {
						message: 'Could not fetch video ids for the channel id'
					}
				});
			}

		}).run();

		return deferred.promise;
	},

	/**
	 *	Function to return a list of videos given a group of video ids
	 *
	 *	@method videos()
	 *	@param 	videoIds - 	the returned json data containing the video ids 
	 *						as search results from the given channel id.
	 *	@return {Object} - 	A promise containing json data with the list of videos
	 */
	videos: function(videoIds) {

		var deferred = Q.defer(),
			self = this,
			fetchedVideoIds = [],
			videoIdsData = EJSON.parse(videoIds.data.content);

		/**
		 *	Meteor requires functions like this to be run inside a fiber
		 */
		self.Fiber(function() {

			if(typeof videoIdsData !== 'undefined' && typeof videoIdsData.items !== 'undefined') {
				/**
				 *	Grab each video ID and add it to the above array
				 */
				_.each(videoIdsData.items, function(item) {	
					if(item.id.kind === 'youtube#video') {
						fetchedVideoIds.push(item.id.videoId);
					}
				});

				if(fetchedVideoIds.length > 0) {

					var params 	= 'key=' + self.apiKey + 
								  '&part=snippet,contentDetails' +
								  '&id=' + fetchedVideoIds.join(),
						url 	= self.endpointUrl + '/videos?' + params;

					HTTP.call('GET', url, function(error, result) {
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
				}
			}
			else {
				deferred.reject({
					status: 'error',
					message: 'Could not fetch the videos from the video ids'
				});
			}
		}).run();

		return deferred.promise;
	}
};