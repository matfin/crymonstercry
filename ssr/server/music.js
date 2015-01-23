/**
 *	Template - seo_music 
 */
SSR.compileTemplate('seo_music', Assets.getText('seo_templates/views/music.html'));

/**
 *	Template - seo_music
 *	Helpers
 */
Template.seo_music.helpers({
	
	/**
	 *	Helper to fetch the artwork for a given release
	 *
	 *	@function	releaseArtwork
	 *	@param		{Object} - the release
	 *	@return		{Object} - object representing the release artwork
	 */
	releaseArtwork: function() {

		if(Helpers.checkNested(this, 'fields', 'albumArtwork', 'sys', 'id')) {

			var entryId 		= this.fields.albumArtwork.sys.id,
				assetQuery 		= {'sys.id': entryId},
				artworkAssets 	= Server.collections.cf_assets.findOne(assetQuery);

			return artworkAssets;

		}
		return false;
	},

	/**
	 *	Helper function to fetch tracks for a given release
	 *	
	 *	@function 	releaseTracks
	 *	@return 	{Object} - object containing the nested tracks
	 */
	releaseTracks: function() {

		if(Helpers.checkNested(this, 'fields', 'tracks')) {

			var entryIds = [];

			/**
			 *	Iterate through and populate the entry ids, to be used
			 *	in making a mongo db query
			 */
			_.each(this.fields.tracks, function(entryId) {
				entryIds.push(entryId.sys.id);
			});

			var query = {
				'sys.id': {$in: entryIds}
			},
			sort = {
				sort: {
					'fields.trackNumber': 1
				}
			},
			releaseTracks = Server.collections.cf_entries.find(query, sort).fetch();
			
			return releaseTracks;
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
		if(Helpers.checkNested(this, 'fields', 'buyersLinks')) {

			var entryIds = [];

			/**
			 *	Then iterate, pulling out the details from the entries
			 */
			_.each(this.fields.buyersLinks, function(entryId) {
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