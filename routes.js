/**
 *	Loading template for all routes
 */
Router.configure({
	loadingTemplate: 'components_loading'
});

Router.onRun(function() {
	this.next();
});

/**
 *	Router map function
 */
Router.map(function() {
	/**
	 *	The landing page
	 */
	this.route('landing', {
		path: '/',
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			/**
			 *	Subscribe to these three collections publised
			 *	from the server. We need them for the featured
			 *	album that will appear on the landing page.
			 */
			return [
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
				'fields.isFeatured': true,
				'contentTypeName': 'release'
			};
			var sort = {
				sort: {
					'fields.releaseDate': -1
				}
			};

			/**
			 *	Grab the featured release and page content
			 */
			var release = App.collections.cf_entries.findOne(query); 

			/**
			 *	If no releases are featured, then grab the latest one
			 */
			if(typeof release === 'undefined') {
				release = App.collections.cf_entries.findOne({contentTypeName: 'release'}, sort);
			}

			/**
			 *	Then return the data
			 */
			return {
				release: release,
				page: App.collections.cf_entries.findOne({'fields.identifier': 'landing'}),
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
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			return [
				Meteor.subscribe('tmblr_posts'),
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
			 *	Sort posts by date
			 */
			var sort = {
				sort: {
					'timestamp': -1
				}
			};

			return {
				posts: App.collections.tmblr_posts.find({}, sort).fetch(),
				page: App.collections.cf_entries.findOne({'fields.identifier': 'news'}),
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
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			return [
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

			var sort = {
					sort: {
						'fields.date': 1
					}
				},
				query = {
					contentTypeName: 'gig'
				},
				gigs = App.collections.cf_entries.find(query, sort).fetch();

			return {
				gigs: gigs,
				page: App.collections.cf_entries.findOne({'fields.identifier': 'tour'}),
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
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			/**
			 *	Subscribe to these three collections publised
			 *	from the server. We need them for the albums 
			 *	we will be listing.
			 */
			return [
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

			var sort = {
				sort: {
					'fields.releaseDate': -1
				}
			},
			query = {
				contentTypeName: 'release'
			},
			releases = App.collections.cf_entries.find(query, sort).fetch();

			return {
				releases: releases,
				page: App.collections.cf_entries.findOne({'fields.identifier': 'music'}),
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
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			/**
			 *	Subscribe to these three collections publised
			 *	from the server. We need them for the albums 
			 *	we will be listing.
			 */
			return [
				Meteor.subscribe('yt_videos'),
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

			var sort = {
				sort: {
					'created_time': -1
				}
			};

			return {
				page: App.collections.cf_entries.findOne({'fields.identifier': 'video'}),
				videos: App.collections.yt_videos.find({}, sort).fetch(),
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
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			/**
			 *	Returning the subscription for Instagram 
			 *	photos here, needed for this view.
			 */
			return [
				Meteor.subscribe('in_images'),
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
			 *	Order by time descending
			 */
			var orderBy = {
				created_time: -1
			};

			return {
				page: App.collections.cf_entries.findOne({'fields.identifier': 'photos'}),
				images: App.collections.in_images.find({},{sort: orderBy}).fetch(),
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
		onBeforeAction: function() {
			this.next();
		},
		waitOn: function() {
			return [
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
			return {
				page: App.collections.cf_entries.findOne({'fields.identifier': 'about'}),
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