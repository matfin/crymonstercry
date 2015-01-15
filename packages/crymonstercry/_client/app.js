/**
 *	Class for curating data fetched from external sources and populating 
 *	it into server side Meteor collections and publishing those.
 *	
 *	@class App
 *	@static
 */
App = {

	/**
	 *	Client side Mongo collections
	 *
	 *	@property 	collections
	 *	@type		{Object}
	 */
	collections: {
		cf_releases: new Mongo.Collection('cf_releases'),
		cf_assets: new Mongo.Collection('cf_assets'),
		cf_entries: new Mongo.Collection('cf_entries'),
		cf_gigs: new Mongo.Collection('cf_gigs'),
		yt_videos: new Mongo.Collection('yt_videos')
	},

	/**
	 *	Building the nav for the site
	 *
	 *	@property	nav
	 *	@type		{Object}
	 */
	nav: {
		top: [
			{
				title: 'News',
				route: 'news'
			},
			{
				title: 'Tour',
				route: 'tour'
			},
			{
				title: 'Music',
				route: 'music'
			},
			{
				title: 'Video',
				route: 'video'
			},
			{
				title: 'Photos',
				route: 'photos'
			},
			{
				title: 'About',
				route: 'about'
			}
		],
		social: [
			{
				title: 	'Facebook',
				link: 	'http://www.facebook.com/crymonstercry'
			},
			{
				title: 	'Twitter',
				link: 	'http://www.twitter.com/crymonstercry'
			},
			{
				title: 	'Instagram',
				link: 	'http://instagram.com/crymonstercry',
			},
			{
				title: 	'Tumblr',
				link: 	'http://crymonstercry.tumblr.com/'
			},
			{
				title: 	'YouTube',
				link:  	'https://www.youtube.com/user/CryMonsterCry'
			},
			{
				title:  'SoundCloud',
				link: 	'https://soundcloud.com/crymonstercry'
			}
		]
	} 
}