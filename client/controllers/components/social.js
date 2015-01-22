/**
 *	Template - components_social
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['components_social'].created = function() {
};

/**
 *	Template - components_social
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['components_social'].rendered = function() {
	this.$('a', '.social').attr('target', '_blank');
};

/**
 *	Template - components_social
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['components_social'].destroyed = function() {
};