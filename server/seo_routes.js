/**
 *	Create the SEO Picker and check the user agent string of incoming bots.
 */
var seoPicker = Picker.filter(function(request, result) {

	/**
	 *	Checking to see if this is coming from one of the following
	 *
	 *	1)	Search engine such as Google or Bing
	 *	2)	Facebook 
	 *	3)	Twitter
	 *
	 *	Returns true if any of these match
	 */
	return 	/_escaped_fragment_/.test(request.url) 						||
			/facebookexternalhit/.test(request.headers['user-agent'])	||
			/Twitterbot/.test(request.headers['user-agent']);
});

/**
 *	Setting up the server side routing to deliver content to bots.
 */
seoPicker.route('/landing', function(params, request, response){

	/**
	 *	Grab the content from the collections
	 */
	var query = {	
		'fields.isFeatured': true,
		'contentTypeName': 'release'
	},
	sort = {
		sort: {
			'fields.releaseDate': -1
		}
	},
	release = App.collections.cf_entries.findOne(query); 
	if(typeof release === 'undefined') {
		release = App.collections.cf_entries.findOne({contentTypeName: 'release'}, sort);
	}

	/**
	 *	Then set the template up for rendering
	 */
	

});