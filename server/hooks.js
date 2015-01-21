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
	 	Fiber		= Meteor.npmRequire('fibers'),
	 	bodyParser	= Meteor.npmRequire('body-parser');

	/**
	 *	Dealing with Contentful callbacks on update of 
	 *	assets andentries an
	 */
	WebApp.connectHandlers
	.use(bodyParser.text())
	.use(bodyParser.json({type: 'application/vnd.contentful.management.v1+json'}))
	.use('/hooks/contentful', function(req, res, next) {

		Fiber(function() {

			console.log(req.headers);
			console.log(req.body);

			res.writeHead(200, {'Content-Type': 'application/json'});
        	res.end(JSON.stringify({
        		status: 'ok',
				message: 'Content updated succesfully'
        	}));

		}).run();
	});
}
