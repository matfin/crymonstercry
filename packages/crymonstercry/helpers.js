/**
 *	Class for server and client side helper functions
 *	
 *	@class Helpers
 *	@static
 */
Helpers = {
	
	/**
	 *	Function to check deply nested objects to see if they 
	 *	exist.
	 *
	 *	@method 	checkNested()
	 *	@param		{Object} - 	the main object containing nested items
	 *	@param		{String} - 	optional string parameters referencing the nested objects
	 *	@return		{Boolean} - true if the nested objects exist, or false if any one of
	 *							them is undefined
	 *
	 */
	checkNested: function(obj) {
		var args = Array.prototype.slice.call(arguments),
			obj = args.shift();

		for(var i = 0; i < args.length; i++) {
			if(!obj || !obj.hasOwnProperty(args[i])) {
				return false;
			}
			obj = obj[args[i]];
		}
		return true;
	},

	/**
	 *	Function to remap incoming fields and reduce to a single nested
	 *	object key pair
	 *
	 *	@method 	flattenObjects()
	 *	@param 		{Object} - 	an array of objects containing fields 
	 *							with deeply nested key value pairs ie:
	 *							{date: {'en-IE': '2015-05-01'}}
	 *
	 *	@param 		{String} - 	A selector to dig the nested value out.
	 *	
	 *	@return 	{Object} - 	Less deeply nested fields ie:
	 *							{date: '2015-05-01'} 
	 */
	flattenObjects: function(fields, selector) {
		
		var filtered = {};
		_.each(fields, function(field, key) {
			/**
			 *	Discard null or undefined values
			 */
			if(field[selector] !== null) {
				filtered[key] = field[selector];
			}
		});
		return filtered;
	},

	/**
	 *	Function to return a date formatted with Moment JS
	 *
	 *	@function 	formattedDate
	 *	@param 		{String} - the date string
	 *	@param 		{String} - desired date format string
	 *	@return 	{String} - the formatted date
	 */
	formattedDate: function(dateString, dateFormat) {
		var m = moment(dateString);
		return m.isValid() ? m.format(dateFormat):dateString;
	},

	/**
	 *	Function to determine if an element is in the viewport,
	 *	used in conjunction with lazy loading of images.
	 *
	 *	@method isInView
	 *	@param {object} element - the element being checked
	 *	@return {boolean} true if the element is in the viewport or false if not.
	 */
	isInView: function(element) {

		var viewportHeight = $(window).height(),
			element = $(element),
			scrollTop = $(window).scrollTop();
			top = $(element).offset().top;

		return (top - scrollTop) <= viewportHeight;
	},

	/**
	 *	Function to load images when the template has been rendered
	 *
	 *	@method lazyLoadImage
	 *	@param {object} element - element object coming from a selector
	 *	@param {options} callback - optional parameters, including callback and aspect ratio
	 *	@return undefined - returns nothing
	 */
	lazyLoadImage: function(element, options) {
		
		/**
		 *	Grab the data we need
		 */
		var img = $(element),
			loaded = img.hasClass('loaded'),
			visible = this.isInView(element),
			src = img.data('src'),
			width = img.width();
			height = (options.height || width * 0.75);
			image = new Image();

		if(!loaded) {
			/**
			 *	Set a temporary height given the width
			 */
			img.height(height);
		}

		if(!loaded && visible) {
			
			/**
			 *	Set the source, which kicks off loading...
			 */
			image.src = src;

			/**
			 *	Then listen for when it has loaded, runing the callback
			 *	when loading has finished.
			 */
			image.onload = function() {
				if(typeof options !== 'undefined' && options.callback !== 'undefined') {
					options.callback();
				}
			}
		}
	},
};