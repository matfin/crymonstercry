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
	}
};

test = function(args) {
	console.log(Array.prototype.slice.call(arguments));
}