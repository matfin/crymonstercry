/**
 *	Template - components_header
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['components_header'].created = function() {
};

/**
 *	Template - components_header
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['components_header'].rendered = function() {
};

/**
 *	Template - components_header
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['components_header'].destroyed = function() {
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

/**
 *	Template - components_header_mobile
 *	Callback function automatically called when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['components_header_mobile'].created = function() {

};

/**
 *	Template - components_header_mobile
 *	Callback function automatically called when the template instance is rendered
 *	@method created
 *	@return undefined
 */
Template['components_header_mobile'].rendered = function() {

};

/**
 *	Template - components_header_mobile
 *	Callback function automatically called when the template instance is destroyed
 *	@method created
 *	@return undefined
 */
Template['components_header_mobile'].destroyed = function() {

};

/**
 *	Template - components_header_mobile 
 *	Events
 */
Template['components_header_mobile'].events({

	'click button': function(e, template) {
		template.$('button').toggleClass('showing');
		template.$('nav').toggleClass('revealed');
	},

	'click a': function(e, template) {
		template.$('button').toggleClass('showing');
		template.$('nav').toggleClass('revealed');
	}

});


