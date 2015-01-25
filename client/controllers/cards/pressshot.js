/**
 *	Template - cards_pressshot
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['cards_pressshot'].created = function() {
	console.log(this.data);
};

/**
 *	Template - cards_pressshot
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_pressshot'].rendered = function() {
	
};

/**
 *	Template - cards_pressshot
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['cards_pressshot'].destroyed = function() {
	
};

/**
 *	Template - cards_pressshot
 *	Helpers
 */
Template['cards_pressshot'].helpers({

	/**
	 *	Function to return the image
	 *
	 *	@function 	image
	 * 	@return  	{Object} - the object containing the image details
	 */
	image: function() {
		if(Helpers.checkNested(this, 'fields', 'image', 'sys', 'id')) {
			return App.collections.cf_assets.findOne({'sys.id': this.fields.image.sys.id});
		}
		return false;
	}

});