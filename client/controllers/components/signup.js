/**
 *	Template - components_signup
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['components_signup'].created = function() {
};

/**
 *	Template - components_signup
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['components_signup'].rendered = function() {
};

/**
 *	Template - components_signup
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['components_signup'].destroyed = function() {
};

/**
 *	Template - components_signup
 *	Helpers
 */
Template['components_signup'].events({

	'click form button': function(e, template) {

		e.preventDefault();		
		var subscriber = template.$('#email').val();

		/**
		 *	Call server side method to subscribe this email address
		 */
		Meteor.call('callPostSubscribe', {email: subscriber}, function(error, result) {

			if(error) {
				template.$('form').addClass('tryagain');
			}
			else {
				template.$('p, form').addClass('flipped');
			}

		});
	},

	'focus input': function(e, template) {
		$(e.currentTarget).parent().removeClass('tryagain');
	}
});
