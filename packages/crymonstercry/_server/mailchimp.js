/**
 *	Class for handling mailchimp email subscribers
 *	
 *	@class MailChimp
 *	@static
 */
MailChimp = {

	/**
	 *	The endpoint for the MailChimp url
	 *	
	 *	@property	endpointUrl
	 *	@type 		{String}
	 */
	endpointUrl: Meteor.settings.mailchimp.endpointUrl,

	/**
	 *	The MailChimp API key
	 *	
	 *	@property 	apiKey,
	 *	@type 		{String}
	 */
	apiKey: Meteor.settings.mailchimp.apiKey,

	/**
	 *	The MailChimp list id
	 *	
	 *	@property 	listId,
	 *	@type 		{String}
	 */
	listId: Meteor.settings.mailchimp.listId,

	/**
	 *	Function to allow these calls to be made on the client
	 *	
	 *	@method 	setup()
	 *	@return 	undefined - returns nothing
	 */
	setup: function() {

		var self = this;
		Meteor.methods({
			callPostSubscribe: function(data) {
				var postSubscriberSync = Meteor.wrapAsync(self.postSubscriber, self);
					result;
				try {
					result = postSubscriberSync(data);
				}	
				catch(e) {
					/**
					 *	We want to return the error to the front end
					 *	instead of it being 'caught' and logged to the 
					 *	server side console. The front end should still
					 *	be able to see it as an error because we are
					 *	throwing it in this instance.
					 */
					throw Meteor.Error(500, "Something went wrong", "Badly wrong"); 
				}	

				return result;
			}
		});
	},

	/**
	 *	Function to post an email to the subscription endpoint
	 *	
	 *	@method 	postSubscriber()
	 *	@param 		{Object} data - the serialized form data
	 *	@param 		{Function} cb - callback function to run.
	 *								Note: assigned by Meteor.wrapAsync
	 *	@return  	undefined - returns nothing
	 */
	postSubscriber: function(data, cb) {
		
		var	self = this,
			data = {
				apikey: this.apiKey,
				email: {
					email: data.email
				},
				id: this.listId
			};

		HTTP.call(
			'POST', 
			self.endpointUrl + '/lists/subscribe.json', 
			{data: data},
			function(error, result) {
				cb(error, result);
			});
	}
};
