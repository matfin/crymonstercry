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
		cf_assets: 		new Mongo.Collection('cf_assets'),
		cf_entries: 	new Mongo.Collection('cf_entries'),
		yt_videos: 		new Mongo.Collection('yt_videos'),
		tmblr_posts: 	new Mongo.Collection('tmblr_posts'),
		in_images:  	new Mongo.Collection('in_images')
	},

	/**
	 *	Dependencies for updating the UI
	 *
	 *	@property 	dependencies
	 *	@type 		{Object}
	 */
	dependencies: {
		scrolled: new Tracker.Dependency
	}
};

/**
 *	Fire off the scrolled dependency when the user scrolls
 *	the window.
 *	Setting the changed function on the dependency will
 *	call any helper functions inside the templates that
 *	need them automatically, for instance when loading 
 *	new images lazily as the user scrolls.
 */
$(window).on('scroll', _.throttle(function() {
	App.dependencies.scrolled.changed();
}, 250));