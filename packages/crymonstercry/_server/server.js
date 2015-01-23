/**
 *	Class for curating data fetched from external sources and populating 
 *	it into server side Meteor collections and publishing those.
 *	
 *	@class Server
 *	@static
 */
Server = {

	/**
	 *	The Mongo Collections for storing fetched data.
	 *
	 *	@property	collections
	 *	@type		{Object}
	 */
	collections: {
		/**
		 *	Contentful collections
		 */
		cf_assets: new Mongo.Collection('cf_assets'),
		cf_entries: new Mongo.Collection('cf_entries'),

		/**
		 *	Youtube videos collection
		 */
		yt_videos: new Mongo.Collection('yt_videos'),

		/**
		 *	Tumblr posts collection
		 */
		tmblr_posts: new Mongo.Collection('tmblr_posts'),

		/** 
		 *	Instagram media collection
		 */
		in_images: new Mongo.Collection('in_images')
	},

	/**
	 *	Function to write a response message to a request
	 *	
	 *	@method 	makeResponse
	 *	@param		{Object} res 			- a http response object
	 *	@param 		{Object} responseData	- response data to return to the client
	 *	@return 	undefined - returns nothing
	 */
	makeResponse: function(res, responseData) {
		res.writeHead(responseData.statusCode, responseData.contentType);
		if(responseData.contentType === 'application/json') {
			res.end(JSON.stringify(responseData.data));
		}
		else {
			res.end(responseData.data);
		}
	}

};
