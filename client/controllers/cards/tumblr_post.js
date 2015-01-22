/**
 *	Template - cards_tumblr_post
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['cards_tumblr_post'].created = function() {
};

/**
 *	Template - cards_tumblr_post
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_tumblr_post'].rendered = function() {
	this.$('a').attr('target', '_blank');
};

/**
 *	Template - cards_tumblr_post
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['cards_tumblr_post'].destroyed = function() {
};

/**
 *	Tempalte - cards_tumblr_post
 *	Helpers
 */
Template['cards_tumblr_post'].helpers({
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