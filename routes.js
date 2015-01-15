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

			// var api_key = 'AIzaSyD5fjm_jlJoQLptrJYM45BHPP1uHlJcfSI',
			// 	channel_id = 'UCdhNjOs9iRMkcTEOfuQJJpw',
			// 	url = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&channelId=' + channel_id + '&part=snippet,id&order=date&maxResults=20';

			// HTTP.call('get', 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyD5fjm_jlJoQLptrJYM45BHPP1uHlJcfSI&part=snippet,contentDetails&id=7iFwsX01uYc,UOcTIAwBrbg,nVfQ1EB888I', function(error, result) {
			// 	console.log(error, result);
			// });

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
	});

	/**
	 *	The news page
	 */
	this.route('news', {
		path: '/news',
		data: function() {

		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_news': 		{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

	/**
	 *	The tour page
	 */
	this.route('tour', {
		path: '/tour',
		data: function() {

		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_tour': 			{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

	/**
	 *	The music page
	 */
	this.route('music', {
		path: '/music',
		data: function() {

		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_music': 			{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

	/**
	 *	The video page
	 */
	this.route('video', {
		path: '/video',
		data: function() {

		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_video': 			{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

	/**
	 *	The photos page
	 */
	this.route('photos', {
		path: '/photos',
		data: function() {

		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_photos': 		{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

	/**
	 *	The about page
	 */
	this.route('about', {
		path: '/about',
		data: function() {

		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_about': 			{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

});