/**
 *	A collection of UI Helpers registered to be used inside templates
 *
 *	These have simple functions that will be used quite commonly across the site.
 */

/**
 *	Function to return the data for the top navigation
 *	
 *	@function 	topNav
 *	@return 	{Object} - an object containing the data for top navigation links
 */
UI.registerHelper('topNav', function() {
	return App.nav.top;
});

/**
 *	Function to return the data for the social navigation
 *	
 *	@function 	socialNav
 *	@return 	{Object} - an object containing the data for social links
 */
UI.registerHelper('socialNav', function() {
	return App.nav.social;
});

/**
 *	Function to return a lowercased string, useful for class names
 *	
 *	@function 	loweCase
 *	@param 		{String} - the string that needs to be converted to lowercase
 *	@return		{String} - a lowercase string
 */
UI.registerHelper('lowerCase', function(str) {
	return str.toLowerCase();
});