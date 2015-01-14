/**
 *	Router map function
 */
Router.map(function() {
	/**
	 *	The landing page
	 */
	this.route('landing', {
		path: '/',
		data: function() {

			HTTP.call('GET', 'https://preview.contentful.com/spaces/gqdx6pq6u7r9/entries?content_type=4i8IEmuoc0GkEYCyKQIwSk&include=1', 
			{
				headers: {
					'Authorization': 'Bearer 0f8a75d80054c0e1dafa5a9b03092fa530502e906b3b9ee7cfb6004bbd70625e',
					'content-type': 'application/vnd.contentful.delivery.v1+json'
				} 

			}, function(error, result){
				var result = EJSON.parse(result.content);

				console.log(result);
			});

			return {
				view: 'landing'
			};
		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_landing': 		{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	})

});