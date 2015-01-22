/**
 *	Template - cards_link
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['cards_link'].created = function() {
};

/**
 *	Template - cards_link
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_link'].rendered = function() {
	this.$('a').attr('target', '_blank');
};

/**
 *	Template - cards_link
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['cards_link'].destroyed = function() {
	
};

/**
 *	Template - cards_link
 *	Helpers
 */
Template['cards_link'].helpers({

	/**
	 *	Function to fetch the SVG asset url for the logo
	 *	representing the external link to buy.
	 *
	 *	@function 	vendorLogo
	 *	@return		{String} - The URL of the vendor svg
	 */
	vendorLogo: function() {
		return '/images/vendors/' + this.fields.linkTitle.toLowerCase() + '.png';
	}

});