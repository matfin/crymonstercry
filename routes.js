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
			return {
				view: 'landing'
			};
		},
		template: 'template_main',
		yieldTemplates: {
			'header': 	{to: 'components_header'},
			'content': 	{to: 'views_landing'},
			'footer': 	{to: 'components_footer'}
		}
	})

});