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
	 *	Function to update Assets and entries for Contentful data
	 *
	 *	@method 	updateContent()
	 *	@param 		{Object} - 	object representing the request body from the 
	 *							Contentful callback webhook
	 *	@return 	{Object} - 	A promise resolved or rejected
	 */
	updateContent: function(requestBody) {

		var deferred = Q.defer(),
			self = this;

		/** 
		 *	First, we need to determine which collection needs updating 
		 */

		console.log(requestBody);


		deferred.resolve();
		return deferred.promise;

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
						if(Helpers.checkNested(item, 'sys', 'contentType', 'sys', 'id')) {
							var contentTypeId 	= item.sys.contentType.sys.id,
								contentType = _.find(self.contentTypes, function(contentType){
									return contentType.id === contentTypeId;
								});
							item.contentTypeName = (typeof contentType !== 'undefined' ? contentType.name:'nested');
						}

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
	}
};