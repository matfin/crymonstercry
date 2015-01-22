/**
 *	Template - views_tour
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_tour'].created = function() {
};

/**
 *	Template - views_tour
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['views_tour'].rendered = function() {
	this.$('a', 'table').attr('target', '_blank');
};

/**
 *	Template - views_tour
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['views_tour'].destroyed = function() {
};