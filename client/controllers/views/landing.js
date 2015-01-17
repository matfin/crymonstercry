/**
 *	Template - views_landing
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_landing'].created = function() {
	$('body').addClass('landing');
	console.log(this.data);
};

/**
 *	Template - components_landing
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['views_landing'].rendered = function() {
};

/**
 *	Template - components_landing
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['views_landing'].destroyed = function() {
	$('body').removeClass();
	$('body').removeAttr('class');
};

/**
 *	Template - components_landing
 *	Helpers
 */
Template['views_landing'].helpers({

	/**
	 *	Function to fetch the release artwork 
	 *	given the release
	 *
	 *	@function 	releaseArtwork
	 *	@return 	{Object} - an object representing a single cf_asset
	 */
	releaseArtwork: function() {
		/**
		 *	From the release, grab the entry id, first checking to see if it exists
		 */
		if(Helpers.checkNested(this, 'release', 'fields', 'albumArtwork', 'sys', 'id')) {

			var entryId 		= this.release.fields.albumArtwork.sys.id,
				assetQuery 		= {'sys.id': entryId},
				artworkAssets 	= App.collections.cf_assets.findOne(assetQuery);

			return artworkAssets;
		}

		return false;
	},

	/**
	 *	Function to fetch external links for a release (Amazon, Spotify, iTunes etc)	
	 *	@function 	releaseLinks
	 *	@return  	{Object} - an object with nested release links representing a cf_entry
	 */
	releaseLinks: function() {
		/**
		 *	Check and see if there are any buyers links for the release
		 */
		if(Helpers.checkNested(this, 'release', 'fields', 'buyersLinks')) {

			var entryIds = [];

			/**
			 *	Then iterate, pulling out the details from the entries
			 */
			_.each(this.release.fields.buyersLinks, function(entryId) {
				entryIds.push(entryId.sys.id);
			});

			/**
			 *	Build the query 
			 */
			var query = {
				'sys.id': {$in: entryIds}
			},
			releaseLinks = App.collections.cf_entries.find(query).fetch();

			console.log(releaseLinks);

			return releaseLinks;
		}

		return false;
	}

});