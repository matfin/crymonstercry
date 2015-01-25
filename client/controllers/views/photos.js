/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_photos'].created = function() {
};

/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['views_photos'].rendered = function() {
	Slider.setup(this.$('.sliderContainer').get(0));
};

/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['views_photos'].destroyed = function() {
};

/**
 *	Template - views_photos
 *	Helpers
 */
Template['views_photos'].helpers({

	/**
	 *	Function to get the total number of press shots
	 *	and use this to get the slider width.
	 *	
	 *	@function 	sliderWidth
	 *	@return 	{Number} - slider width as percentage
	 */
	sliderWidth: function() {
		return this.pressShots.length * 100;
	}

});