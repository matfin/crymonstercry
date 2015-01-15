/**
 *	A collection of UI Helpers registered to be used inside templates
 *
 *	These have simple functions that will be used quite commonly across the site.
 */

/**
 *	Function to return the data for the top navigation
 *	
 *	@function 	topNav
 *	@return 	{Object} - an object containing the top navigation
 */
UI.registerHelper('topNav', function() {
	return App.nav.top;
});
