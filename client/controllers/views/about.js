/**
 *	Template - views_about
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_about'].created = function() {
	console.log(this.data);
};

/**
 *	Template - views_about
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['views_about'].rendered = function() {
};

/**
 *	Template - views_about
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['views_about'].destroyed = function() {
};

/**
 *	Template - views_about
 *	Helpers
 */
Template['views_about'].helpers({

	/**
	 *	Function to return the image for the about page.
	 *
	 *	@function 	image
	 * 	@return  	{Object} - the object containing the image details
	 */

	image: function() {
		if(Helpers.checkNested(this, 'photo', 'fields', 'image', 'sys', 'id')) {
			return App.collections.cf_assets.findOne({'sys.id': this.photo.fields.image.sys.id});
		}
		return false;
	}
});