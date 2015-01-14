/**
 *	Class for fetching and managing data fetched from the Contentful API
 *	
 *	@class Contentful
 *	@static
 */
Contentful = {

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
	 *	Function to return entries for 'gigs' from the Contentful
	 *	API endpoint.
	 *	
	 *	@method gigs()
	 *	@return {Object} - a promise containing a nested json object containing filtered gig entries
	 */
	gigs: function() {

		return this.connectAndFetch(function() {

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