/**
 *	Template - components_header
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['components_header'].created = function() {
	console.log('components_header: created()');
};

/**
 *	Template - components_header
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['components_header'].rendered = function() {
	console.log('components_header: rendered()');
};

/**
 *	Template - components_header
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['components_header'].destroyed = function() {
	console.log('components_header: destroyed()');
};

/**
 *	Template - components_header
 *	Helper functions
 */
Template['components_header'].helpers({

	/**
	 *	Return an active class if the top nav link 
	 *	is on the current view
	 */
	activeClass: function(parent) {
		return parent.view === this.route ? 'active':false;
	}

});