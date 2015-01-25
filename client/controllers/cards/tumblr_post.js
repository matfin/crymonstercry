/**
 *	Template - cards_tumblr_text
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['cards_tumblr_text'].created = function() {
};

/**
 *	Template - cards_tumblr_text
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_tumblr_text'].rendered = function() {
	
};

/**
 *	Template - cards_tumblr_text
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['cards_tumblr_text'].destroyed = function() {
};

/**
 *	Template - cards_tumblr_text
 *	Helpers
 */
Template['cards_tumblr_text'].helpers({
	/**
	 *	Convert the tumblr data timestamp to a 
	 *	javascript timestamp for moment.js
	 *
	 *	@function 	jsTimestamp
	 *	@return 	{Number} - the JS timestamp
	 */
	jsTimestamp: function() {
		return new Date(this.timestamp * 1000);
	}
});

/**
 *	Template - cards_tumblr_photo
 *	Helpers
 */
Template['cards_tumblr_photo'].helpers({
	/**
	 *	Extracting the photos
	 */
	images: function() {
		// if(Helpers.checkNested(this, 'photos', '0', 'alt_sizes', '1')) {
		// 	return this.photos[0].alt_sizes[1].url;
		// }
		if(Helpers.checkNested(this, 'photos')) {
			return this.photos;
		}
	}
});