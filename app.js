/** 
 *	App startup for the server - where we fetch data 
 *	and push it into our collections.
 */
if(Meteor.isServer) {
	/**
	 *	Log the server boot up time
	 */
	console.log('Meteor server booting up - ' + new Date().toString());

	Server.populateCFReleases().then(function() {
		console.log('Releases populated successfully');
	}).fail(function() {
		console.log('Releases could not be populated');
	});

	Server.populateCFGigs().then(function() {
		console.log('Gigs populated successfully');
	}).fail(function() {
		console.log('Gigs could not be populated');
	});

}