Meteor.startup(function() {

	/** 
	 *	App startup for the server - where we fetch data 
	 *	and push it into our collections.
	 */
	if(Meteor.isServer) {

		/**
		 *	Log the server boot up time
		 */
		console.log('Meteor server booting up - ' + new Date().toString());

		/**
		 *	Grabbing Contentful Assets and Entries
		 */
		Contentful.fetchAndPopulate().then(function() {
			console.log('Contentful assets and entries populated successfully');
		}).fail(function(err) {
			console.log('Could not populate Contentful data');
		});

		/**
		 *	Grabbing YouTube videos
		 */
		// Youtube.populateVideos().then(function(){
		// 	console.log('YouTube videos populated successfully');
		// }).fail(function() {
		// 	console.log('Could not populate YouTube videos');
		// });

		/**
		 *	Grabbing Tumblr posts
		 */
		// Tumblr.populatePosts().then(function() {
		// 	console.log('Tumblr posts populated successfully');
		// }).fail(function() {
		// 	console.log('Could not populate Tumblr posts');
		// });

		/**
		 *	Fetch instragram content
		 */
		// Instagram.populateContent().then(function() {
		// 	console.log('Instagram media populated successfully');
		// }).fail(function() {
		// 	console.log('Could not populate Instagram media');
		// });

		/**
		 *	Start listening for content changes
		 */
		Server.listenForContentChanges();
	}

});

