/**
 *	Router map function
 */
Router.map(function() {
	/**
	 *	The landing page
	 */
	this.route('landing', {
		path: '/',
		subscriptions: function() {
			/**
			 *	Subscribe to these three collections publised
			 *	from the server. We need them for the featured
			 *	album that will appear on the landing page.
			 */
			return [
				Meteor.subscribe('cf_releases'),
				Meteor.subscribe('cf_assets'),
				Meteor.subscribe('cf_entries')
			];
		},
		action: function() {
			if(this.ready()) {
				this.render();
			}
			else {
				this.next();
			}
		},
		data: function() {

			/** 
			 *	Fetch the featured album or failing that,
			 *	fetch the latest album added. These are 
			 *	the queries we can use to do this.
			 */
			var query = {	
				isFeatured: {
					'fields.isFeatured': true
				}
			};
			var sort = {
				sort: {
					'fields.releaseDate': -1
				}
			};

			/**
			 *	Grab the featured release
			 */
			var release = App.collections.cf_releases.findOne(query.isFeatured);

			/**
			 *	If no releases are featured, then grab the latest one
			 */
			if(typeof release === 'undefined') {
				release = App.collections.cf_releases.findOne({}, sort);
			}

			/**
			 *	Then return the data
			 */
			return {
				release: release,
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
			return {
				view: 'news'
			};
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
		subscriptions: function() {
			return [
				Meteor.subscribe('cf_gigs')
			];
		},
		action: function() {
			if(this.ready()) {
				this.render();
			}
			else {
				this.next();
			}
		},

		data: function() {

			var sort = {
					sort: {
						'fields.date': 1
					}
				},
				gigs = App.collections.cf_gigs.find({}, sort).fetch();

			return {
				gigs: gigs,
				view: 'tour'
			};
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
			return {
				view: 'music'
			};
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
			return {
				view: 'video'
			};
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
			return {
				view: 'photos'
			};
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
			return {
				view: 'about'
			};
		},
		template: 'template_main',
		yieldTemplates: {
			'components_header': 	{to: 'header'},
			'views_about': 			{to: 'content'},
			'components_footer': 	{to: 'footer'}
		}
	});

});