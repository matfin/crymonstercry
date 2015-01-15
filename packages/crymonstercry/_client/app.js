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
	}

}