/**
 *	Template - seo_landing
 */
SSR.compileTemplate('seo_landing', Assets.getText('seo_templates/views/landing.html'));

/**
 *	Template - seo_landing
 *	Helpers
 */
Template.seo_landing.helpers({

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
				artworkAssets 	= Server.collections.cf_assets.findOne(assetQuery);

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
			releaseLinks = Server.collections.cf_entries.find(query).fetch();

			return releaseLinks;
		}

		return false;
	}

});