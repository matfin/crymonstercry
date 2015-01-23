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
		Meteor.methods({
			postSubscriber: this.postSubscriber.bind(this)
		});
	},

	/**
	 *	Function to post an email to the subscription endpoint
	 *	
	 *	@method 	postSubscriber()
	 *	@param 		{Object} data - the serialized form data
	 *	@return  	{Object} - a resolved or rejected promise
	 */
	postSubscriber: function(data) {

		var deferred = Q.defer(),
			self = this,
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
			function(error, result){

				if(error) {
					console.log(error);
					deferred.reject({
						status: 'error',
						data: error
					});
				}
				else {
					console.log(result);
					deferred.resolve({
						status: 'ok',
						data: result
					});
				}
		});

		return deferred.promise;
	}

}
