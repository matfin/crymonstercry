/**
 *	Class for curating data fetched from external sources and populating 
 *	it into server side Meteor collections and publishing those.
 *	
 *	@class Content
 *	@static
 */
Server = {

	/**
	 *	The Mongo Collections for storing fetched data.
	 *
	 *	@property	collections
	 *	@typpe		{Object}
	 */
	collections: {
		cf_releases: new Mongo.Collection('cf_releases'),
		cf_assets: new Mongo.Collection('cf_assets'),
		cf_entries: new Mongo.Collection('cf_entries')
	},

	/**
	 *	Function to populate releases from the contentful endpoint
	 *
	 *	@method populateCFReleases()
	 *	@return {Object} - a resolved or rejected promise
	 */
	populateCFReleases: function() {

		var deferred = Q.defer(),
			self = Server;

		Contentful.releases().then(function(result) {
			
			_.each(result.data.collections, function(collection) {

				var boundFunction = Meteor.bindEnvironment(function() {
					self.collections[collection.name].remove({});
				});

				

				/** 
				 *	Clear out old items
				 */
				//self.collections[collection.name].remove({});

				// _.each(collection.items, function(item) {
				// 	self.collections[collection.name].insert(item);
				// });
				// Meteor.publish(item.collection, function() {
				// 	return self[item.collection].find();
				// });
			});

			deferred.resolve();

		}).fail(function(error) {
			
			deferred.reject(error);

		});		

		return deferred.promise;
	}

}