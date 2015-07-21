/**
 *	Cry Monster Cry
 *	Server and client side package for this app.
 *	Matt Finucane 2015
 */

Package.describe({
	summary: 	'This package contains client and server side code for fetching and publishing data.',
	version: 	'1.2.6',
	name:  		'crymonstercry' 
});

Package.onUse(function(api) {

	/**
	 *	Minimum version of Meteor Required
	 */
	api.versionsFrom('1.0.2.1');

	/**
	 *	Other packages as requirements
	 */
	api.use('underscore', 	['client', 'server']);
	api.use('mongo', 		['client', 'server']);
	api.use('aramk:q',		'server');
	api.use('http', 		'server');
	api.use('ejson',		'server');
	api.use('deps',			'client');
	api.use('jquery',		'client');

	
	/**
	 *	Server side files included as part of this package
	 */
	api.addFiles([
		'_server/contentful.js',
		'_server/instagram.js',
		'_server/tumblr.js',
		'_server/mailchimp.js',
		'_server/server.js'
	], 	'server');

	/**
	 *	Client side files included as part of this package
	 */
	api.addFiles([
		'_client/app.js'
	], 	'client');

	/**
	 *	Client and server side files included as part of this package
	 */
	api.addFiles([
		'helpers.js',
		'nav.js'
	], ['client', 'server']);

	/**
	 *	Exports
	 */
	api.export('Server');
	api.export('App');
	api.export('Helpers');
	api.export('Nav');
	api.export('Contentful');
	api.export('Instagram');
	api.export('Tumblr');
	api.export('MailChimp');
});