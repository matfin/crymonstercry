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
	return Nav.top;
});

/**
 *	Function to return the data for the social navigation
 *	
 *	@function 	socialNav
 *	@return 	{Object} - an object containing the data for social links
 */
UI.registerHelper('socialNav', function() {
	return Nav.social;
});

/**
 *	Function to return a lowercased string, useful for class names
 *	
 *	@function 	lowerCase
 *	@param 		{String} - the string that needs to be converted to lowercase
 *	@return		{String} - a lowercase string
 */
UI.registerHelper('lowerCase', function(str) {
	return str.toLowerCase();
});

/**
 *	Function to access an array indexed item in a template
 *
 *	@function 	itemAtIndex
 *	@param 		{Array}  - the array 
 *	@param 		{Number} - the index number
 *	@return  	{Object} - the item at the index
 */
UI.registerHelper('itemAtIndex', function(collection, index) {
	return collection[index];
});

/**
 *	Function to return a date formatted with Moment JS
 *
 *	@function 	formattedDate
 *	@param 		{String} - the date string
 *	@param 		{String} - desired date format string
 *	@return 	{String} - the formatted date
 */
UI.registerHelper('formattedDate', function(dateString, dateFormat) {
	return Helpers.formattedDate(dateString, dateFormat);
});

/**
 *	Function to return a date formatted with Moment JS
 *
 *	@function formattedDateFromTS
 *	@param 		{Number} - the date timestamp
 *	@param 		{String} - desired date format string
 *	@return 	{String} - the formatted date
 */
UI.registerHelper('formattedDateFromTS', function(timestamp, dateFormat) {
	return Helpers.formattedDateFromTS(timestamp, dateFormat);
});

/**
 *	Helper function to determine if an object exists
 *
 *	@function 	fieldsExists
 *	@param 		{Object} - the field
 *	@return 	{Boolean}
 */
UI.registerHelper('fieldExists', function(field) {
	return typeof field !== 'undefined';
});

/**
 *	Helper function to return the current device type based on screen size
 *
 *	@function 	deviceIsOfClass
 *	@param 		{String}  - device class name: can be 'mobile', 'tablet' or 'desktop'
 *	@return 	{Boolean} - true if the device string matches
 */
UI.registerHelper('deviceIsOfClass', function(deviceClassName) {

	/**
	 *	Call this when the window is resized
	 */
	App.dependencies.resized.depend();

	var width = $(window).width();

	var sizes = {
		desktop: 	width >= 1024,
		tablet: 	width > 640 && width < 1024,
		mobile: 	width <= 640
	};

	return (sizes[deviceClassName] !== 'undefined') ? sizes[deviceClassName]:false;
});
