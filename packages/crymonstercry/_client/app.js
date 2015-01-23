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
	}
}