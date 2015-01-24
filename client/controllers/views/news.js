/**
 *	Template - views_news
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_news'].created = function() {
};

/**
 *	Template - views_news
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['views_news'].rendered = function() {
	this.$('a').attr('target', '_blank');
};

/**
 *	Template - views_news
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['views_news'].destroyed = function() {
};

/**
 *	Tempalte - views_news
 *	Helpers
 */
Template['views_news'].helpers({

	/**
	 *	Return true if this is of type text
	 */
	isText: function() {
		return this.type === 'text';
	},

	/**
	 *	Return true if this is of type photo
	 */
	isPhoto: function() {
		return this.type === 'photo';
	}

});