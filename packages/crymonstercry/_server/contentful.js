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
	 *	Function to populate releases from the contentful endpoint
	 *
	 *	@method populateCFReleases()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateCFReleases: function() {

		var deferred = Q.defer(),
			self = this;

		this.releases().then(function(result) {
		
			_.each(result.data.collections, function(collection) {
				/**
				 *	Calling Meteor to insert to and remove from a Collection
				 *	requires the use of a fiber
				 */
				self.Fiber(function() {
					
					/**
					 *	Clear out the old data on reboot
					 *	@TODO: This is inefficent, use upsert
					 */
					Server.collections[collection.name].remove({});

					/**
					 *	Go through each group of returned items
					 *	and insert them to the correct collections.
					 */
					_.each(collection.items, function(item) {
						Server.collections[collection.name].insert(item);
					});

					/**
					 *	Then we publish the collection so the client side
					 *	MiniMongo instance can access it.
					 */
					Meteor.publish(collection.name, function() {
						return Server.collections[collection.name].find({});
					});

				}).run();
			});

			deferred.resolve();

		}).fail(function(error) {
			
			deferred.reject(error);

		});
	
		return deferred.promise;
	},

	/**
	 *	Function to populate gigs from the contentful endpoint
	 *	
	 *	@method populateCFGigs()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateCFGigs: function() {
		var deferred = Q.defer(),
			self = this;

		this.gigs().then(function(result) {

			_.each(result.data.collections, function(collection) {

				/**
				 *	Calling Meteor to insert to and remove from a Collection
				 *	requires the use of a fiber
				 */
				self.Fiber(function() {

					/**
					 * Clear out old data.
					 */
					Server.collections[collection.name].remove({});

					/**
					 *	Then populate new data
					 */
					_.each(collection.items, function(item) {
						Server.collections[collection.name].insert(item);
					});

					Meteor.publish(collection.name, function() {
						return Server.collections[collection.name].find({});
					});

				}).run();

			});

			deferred.resolve();

		}).fail(function(error) {

			deferred.reject(error);

		});

		return deferred.promise;
	},

	/**
	 *	Function to return entries for 'gigs' from the Contentful
	 *	API endpoint.
	 *	
	 *	@method gigs()
	 *	@return {Object} - a promise containing a nested json object containing filtered gig entries
	 */
	gigs: function() {

		return this.connectAndFetch({
			contentType: this.contentTypes.gigs,
			include: 1,
			filterFunction: function(result) {
				/**
				 *	Convert the result to a json object
				 */
				resultContent = EJSON.parse(result.content);

				/**
				 *	Return the modified result object, along
				 *	with the name of the collection its data
				 *	should be populated to.
				 *
				 *	Since this is a simple content type with 
				 *	no linked assets or entries, we return a
				 *	simpler object
				 */
				return {
					collections: [
						{	
							name: 'cf_gigs',
							items: resultContent.items
						}
					]
				};
			}
		});
	},

	/**
	 *	Function to return entries for 'releases' from the Contentful
	 *	API endpoint.
	 *	
	 *	@method releases()
	 *	@return {Object} - a promise containing a nested json object containing filtered release entries
	 */
	releases: function() {

		return this.connectAndFetch({
			contentType: this.contentTypes.releases,
			include: 1,
			filterFunction: function(result) {
				/**
				 *	Convert the result to a json object
				 */
				resultContent = EJSON.parse(result.content);

				/** 
				 *	Return modified result object
				 */
				return {
					collections: [
						{
							name: 'cf_releases',
							items: resultContent.items
						},
						{
							name: 'cf_assets',
							items: resultContent.includes.Asset
						},
						{
							name: 'cf_entries',
							items: resultContent.includes.Entry
						}
					]
				};
			}
		});
	},

	/**
	 *	Function to make a HTTP call to the Contentful endpoint,
	 *	setting headers and params particular to this service.
	 *
	 *	@method 	connectAndFetch()
	 *	@param 		{Object} - 	Object containing options defining how we fetch the data and
	 *							a filter function we can use to process it.
	 *	@return 	{Object} - 	a resolved promise on success, or a rejected promise on error
	 */
	connectAndFetch: function(options) {
		var deferred = Q.defer(),
			self = this,
			url  = 	this.endpointUrl 
					+ '/spaces/' 
					+ this.spaceId 
					+ '/entries?content_type=' 
					+ options.contentType 
					+ '&include=' 
					+ options.include;

		HTTP.call('GET', url, {
			headers: {
				'Authorization': 	self.authorisationHeader,
				'content-type': 	self.contentTypeHeader
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
				 *	Call the filter function on the result
				 */
				result = options.filterFunction(result);

				deferred.resolve({
					status: 'ok',
					message: 'Connection to contentful succeeded',
					data: result
				});
			}
		});

		/**
		 *	Return the resolved or rejected promise;
		 */
		return deferred.promise;
	}
};