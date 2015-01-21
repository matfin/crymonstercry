/**
 *	Server side routes for dealing with callbacks and hooks.
 *	This is where external content providers call hooks when 
 *	content has been updated.
 */

if(Meteor.isServer) {

	/**
	 *	Required NPM modules
	 */
	var connect 	= Meteor.npmRequire('connect'),
	 	fiber		= Meteor.npmRequire('fibers'),
	 	bodyParser	= Meteor.npmRequire('body-parser');

	/**
	 *	Dealing with Contentful callbacks on update of 
	 *	assets andentries an
	 */
	WebApp.connectHandlers
	.use(bodyParser.text())
	.use(bodyParser.json({type: 'application/vnd.contentful.management.v1+json'}))
	.use('/hooks/contentful', function(req, res, next) {

		fiber(function() {

			/**
			 *	Promise returned from update functions
			 */
			var promise = false;

			/**
			 *	Checking x-contentful-topic for update or delete
			 */
			if(Helpers.checkNested(req, 'headers', 'X-Contentful-Topic')) {

				switch(req.headers['X-Contentful-Topic']) {
					case 'ContentManagement.Entry.publish':
					case 'ContentManagement.Asset.publish': {
					
						break;
					}
					case 'ContentManagement.Entry.unpublish':
					case 'ContentManagement.Asset.unpublish': {
						
						break;
					}
					default: {
						console.log('Do nothing');
						break;
					}
				}

			}

			res.writeHead(200, {'Content-Type': 'application/json'});
        	res.end(JSON.stringify({
        		status: 'ok',
				message: 'Content updated succesfully'
        	}));

		}).run();
	});
}


