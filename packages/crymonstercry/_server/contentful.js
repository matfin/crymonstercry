/**
 *	Class for fetching and managing data fetched from the Contentful API
 *	
 *	@class Contentful
 *	@static
 */
Contentful = {

	/**
	 *	Fiber needed for making async calls
	 */
	Fiber: Npm.require('fibers'),

	/**
	 *	The endpoint url for the Contentful API which is populated
	 *	from Meteor settings.
	 *	
	 *	@property 	endpointUrl
	 *	@type		{String}
	 */
	endpointUrl: Meteor.settings.contentful.endpointUrl,

	/** 
	 *	The Contentful authorisation header with access token, required to 
	 *  fetch data. Populated from Meteor Settings.
	 *
	 *	@property	accessToken
	 *	@type		{String}
	 */
	authorisationHeader: Meteor.settings.contentful.authorisationHeader,

	/**
	 *	The Contentful space id, which contains content types and 
	 *	associated entries, populated from Meteor Settings.
	 *
	 *	@property	spaceId
	 *	@type 		{String}
	 */
	spaceId: Meteor.settings.contentful.spaceId,

	/**
	 *	Contentful content type id mappings to fetch filtered content
	 *
	 *	@property 	contentTypes
	 *	@type 		{Object}
	 */
	contentTypes: Meteor.settings.contentful.contentTypes,

	/**
	 *	Contentful content type header - to ensure we use the same endpoint
	 *	version
	 *
	 *	@property	contentTypeHeader
	 *	@type 		{String}
	 */
	contentTypeHeader: Meteor.settings.contentful.contentTypeHeader,

	/**
	 *	Function to check the credentials on the request header
	 *	are valid
	 *
	 *	@method 	checkCredentials
	 *	@param  	{Object} request - the incoming request
	 *	@return 	{Boolean} - true if credentials are valid
	 */
	checkCredentials: function(request) {
		return 	Helpers.checkNested(request, 'headers', 'authorization') &&
				request.headers.authorization === Meteor.settings.contentful.key;

	},

	/**
	 *	Function to handle incoming requests from the Contentful API
	 *	This function examines an incoming requests, looking at the 
	 *	headers and body and calls the appropriate function.
	 *	
	 *	@method 	handleRequest()
	 *	@param 		{Object} request - the incoming request object
	 *	@return 	{Object} - a resolved or rejected promise
	 */
	handleRequest: function(request) {
		/**
		 *	Determine if we are updating or deleting content
		 */
		switch(request.headers['x-contentful-topic']) {
			case 'ContentManagement.Entry.publish':
			case 'ContentManagement.Asset.publish': {

				return this.contentPublish(request.body);

				break;
			}
			case 'ContentManagement.Entry.unpublish':
			case 'ContentManagement.Asset.unpublish': {

				return this.contentUnpublish(request.body);

				break;
			}
			default: {
				var deferred = Q.defer();
				deferred.resolve({
					status: 'ok',
					messahe: 'No content has been changed.'
				});
				return deferred.promise;
				break;
			}
		}
	},

	/**
	 *	Function to unpublish or delete Assets and Entries for 
	 *	Contentful data.
	 *
	 *	@method 	contentUnpublish
	 *	@param 		{Object} requestBody - the request body
	 *	@return 	{Object} - A promise resolved or rejected
	 */
	contentUnpublish: function(requestBody) {
		var deferred = Q.defer(),
			self = this,
			entry = requestBody,
			collection;

		/**
		 *	Check to see if we have the correct entry type
		 *	and load the correct collection to be updated
		 */
		switch(entry.sys.type) {
			case 'DeletedEntry': {
				collection = Server.collections.cf_entries;
				break;
			}
			case 'DeletedAsset': {
				collection = Server.collection.cf_assets;
				break;
			}
			default: {
				deferred.reject({
					status: 'error',
					message: 'Entry type does not exist. Exiting'
				});
			}
		}

		/**
		 *	If we have a collection to update
		 */
		if(typeof collection !== 'undefined') {
			/**
			 *	Call the delete function from within a Fiber
			 */
			this.Fiber(function() {

				/**
				 *	Remove the item from the collection
				 */
				collection.remove({
					'sys.id': entry.sys.id
				});

			}).run();
		}

		return deferred.promise;
	},

	/**
	 *	Function to update Assets and entries for Contentful data
	 *
	 *	@method 	contentPublish()
	 *	@param 		{Object} requestBody - the request body with content payload 
	 *	@return 	{Object} - A promise resolved or rejected
	 */
	contentPublish: function(requestBody) {

		var deferred 	= Q.defer(),
			self 		= this,
			entry 		= requestBody,
			collection;

		/**
		 *	Check to see if we have the correct entry type
		 *	and load the correct collection to be updated
		 */
		switch(entry.sys.type) {
			case 'Entry': {
				collection = Server.collections.cf_entries;
				break;
			}
			case 'Asset': {
				collection = Server.collection.cf_assets;
				break;
			}
			default: {
				deferred.reject({
					status: 'error',
					message: 'Entry type does not exist. Exiting'
				});
			}
		}

		/**
		 *	If we have a collection to update
		 */
		if(typeof collection !== 'undefined') {
			/**
			 *	Call the updte function from within a Fiber
			 */

			this.Fiber(function() {

				collection.update(
					{
						'sys.id': entry.sys.id
					},
					{
						fields: Helpers.flattenObjects(entry.fields, 'en-IE'),
						sys: entry.sys,
						contentTypeName: self.contentTypeName(entry)
					},
					{
						upsert: true
					}	
				);

				deferred.resolve({
					status: 'ok',
					message: 'Contentful content updated ok'
				})

			}).run();
		}
		
		return deferred.promise;
	},

	/**
	 *	Function to fetch the content type name for an entry given its 
	 *	content type id.
	 *
	 *	@method 	contentTypeName()
	 *	@param 		{Object} - entry
	 *	@return 	{String} - the content type name as a string
	 */
	contentTypeName: function(entry) {

		if(Helpers.checkNested(entry, 'sys', 'contentType', 'sys', 'id')) {

			var contentTypeId = entry.sys.contentType.sys.id,
				contentType = _.find(this.contentTypes, function(contentType) {
				return contentType.id === contentTypeId;
			});

			return (typeof contentType !== 'undefined') ? contentType.name:'nested';
		}

		return 'nested';
	},


	/**
	 *	Function to make a HTTP call to the Contentful endpoint,
	 *	setting headers and params particular to this service.
	 *
	 *	@method 	fetchAndPopulate()
	 *	@return 	{Object} - 	a resolved promise on success, or a rejected promise on error
	 */
	fetchAndPopulate: function() {
		var deferred = Q.defer(),
			self = this,
			url  = 	this.endpointUrl + '/spaces/' + this.spaceId + '/entries';

		HTTP.call('GET', url, {
			headers: {
				'Authorization': 	self.authorisationHeader,
				'Content-Type': 	self.contentTypeHeader
			},
			params: {
				include: 1
			}
		}, function(error, result) {
			/** 
			 *	Callback with failure
			 */
			if(error) {
				deferred.reject({
					status: 'error',
					message: 'Error connecting to the contentful endpoint',
					data: error
				});
			}
			/**
			 *	Callback with success
			 */
			else {
				/**
				 *	Turn the result into an object
				 */
				var data = EJSON.parse(result.content);

				/**
				 *	Wrapped in a fiber, we will need to insert the entries
				 *	and assets into their collections.
				 */
				self.Fiber(function() {
					/**
					 *	Clear out the existing collections
					 */
					Server.collections.cf_entries.remove({});
					Server.collections.cf_assets.remove({});

					/** 
					 *	Dealing with Entries first
					 */
					_.each(data.items, function(item) {

						/**
						 *	We need to tag gigs and releases before we insert them
						 */
						item.contentTypeName = self.contentTypeName(item);

						/**
						 *	Then we insert them to the collection
						 */
						Server.collections.cf_entries.insert(item);
					});
					/**
					 *	Publish the Entries
					 */
					Meteor.publish('cf_entries', function() {
						return Server.collections.cf_entries.find({});
					});

					/**
					 *	Now we need to insert the Assets
					 */
					_.each(data.includes.Asset, function(include) {
						Server.collections.cf_assets.insert(include);
					});
					/**
					 *	Publish the Assets
					 */
					Meteor.publish('cf_assets', function() {
						return Server.collections.cf_assets.find({});
					});

					/**
					 *	Then resolve the promise
					 */
					deferred.resolve({
						status: 'ok',
						message: 'Fetching and population of Assets and Entries data succeeded.',
						data: result
					});

				}).run();
			}
		});

		/**
		 *	Return the resolved or rejected promise;
		 */
		return deferred.promise;
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
			if(!self.checkCredentials(req)) {
				Server.makeResponse(res, {
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
				self.handleRequest(req).then(function(result) {
					/**
					 *	Success
					 */
					Server.makeResponse(res, {
						statusCode: 200,
						contentType: 'application/json',
						data: result
					});
				}).fail(function(error) {
					/**
					 *	Fail
					 */
					Server.makeResponse(res, {
						statusCode: 200,
						contentType: 'application/json',
						data: error
					});
				});
			}
		});
	},
};