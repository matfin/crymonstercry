/**
 *	Class for fetching and managing content from Instagram
 *	
 *	@class Instagram
 *	@static
 */

var Fiber = Npm.require('fibers');

Instagram = {

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



