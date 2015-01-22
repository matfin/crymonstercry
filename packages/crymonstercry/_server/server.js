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
	 *	Set up listeners for incoming hooks from external content providers.
	 *	These will be fired when content is updated, and they will be used to
	 *	update collections automatically.
	 *
	 *	@method 	listenForContentChanges
	 *	@return 	undefined - returns nothing
	 */
	listenForContentChanges: function() {

		/**
		 *	Required NPM modules
		 */
		var connect 	= Meteor.npmRequire('connect'),
			fiber 		= Meteor.npmRequire('fibers'),
			bodyParser	= Meteor.npmRequire('body-parser'),
			self		= this;

		WebApp.connectHandlers
		.use(bodyParser.json({type: 'application/json'}))
		.use(bodyParser.json({type: 'application/vnd.contentful.management.v1+json'}))
		/**
		 *	Handling incoming requests from Contentful webhooks
		 */
		.use('/hooks/contentful', function(req, res, next) {

			/**
			 *	Checking credentials
			 */
			if(!Contentful.checkCredentials(req)) {
				self.makeResponse(res, {
					statusCode: 403,
					contentType: 'application/json',
					data: {
						status: 'error',
						message: 'Invalid credentials'
					}
				});
			}
			else {
				/**
				 *	Call on the Contentful object to handle this request
				 */
				Contentful.handleRequest(req).then(function(result) {
					/**
					 *	Success
					 */
					self.makeResponse(res, {
						statusCode: 200,
						contentType: 'application/json',
						data: result
					});
				}).fail(function(error) {
					/**
					 *	Fail
					 */
					self.makeResponse(res, {
						statusCode: 200,
						contentType: 'application/json',
						data: error
					});
				});
			}
		})
		/**
		 *	Handling incoming requests from Instagram
		 */
		.use('/hooks/instagram', function(req, res, next){

			/**
			 *	Check if this is a subscription verification request.
			 *	Instagram sents a GET request to verify real time 
			 *	subscriptions.
			 */
			if(Helpers.checkNested(req, 'query', 'hub.mode')) {
				self.makeResponse(res, {
					statusCode: 200,
					contentType: 'text/plain',
					data: req.query['hub.challenge']
				});
			}
			else {
				self.makeResponse(res, {
					statusCode: 200,
					contentType: 'application/json',
					data: {
						status: 'ok',
						message: 'Instagram route has been hit'
					}
				});
			}
		});
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
