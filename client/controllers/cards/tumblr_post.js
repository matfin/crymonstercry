/**
 *	Template - cards_tumblr_text
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['cards_tumblr_text'].created = function() {
	/**
	 *	Tumblr does not return valid timestamps for use with 
	 *	Moment.js so we need to convert the timestamp to a 
	 *	valid javascript format.
	 */
	this.data.js_timestamp = this.data.timestamp * 1000;
};

/**
 *	Template - cards_tumblr_text
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_tumblr_text'].rendered = function() {
	
};

/**
 *	Template - cards_tumblr_text
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['cards_tumblr_text'].destroyed = function() {
};

/**
 *	Template - cards_tumblr_text
 *	Helpers
 */
Template['cards_tumblr_text'].helpers({
	/**
	 *	Convert the tumblr data timestamp to a 
	 *	javascript timestamp for moment.js
	 *
	 *	@function 	jsTimestamp
	 *	@return 	{Number} - the JS timestamp
	 */
	jsTimestamp: function() {
		return new Date(this.timestamp * 1000);
	}
});

/**
 *	Template - cards_tumblr_photo
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_tumblr_photo'].rendered = function() {
	/**
	 *	Lazy load images
	 */
	this.autorun(function() {

		/**
		 *	Rerun this when the scrolled dependency
		 *	has been fired.
		 */
		App.dependencies.scrolled.depend();

		var images = self.$('img');

		$.each(images, function(index, image) {
			Helpers.lazyLoadImage(image, {
				callback: function() {
					/**
					 *	Remove the loading icon
					 */
					$('i', $(image).parent()).remove();

					/**
					 *	Then set the image up once loaded
					 */
					$(image).prop('src', $(image).data('src'));
					$(image).prop('height', 'auto');
					$(image).removeAttr('data');
					$(image).addClass('loaded');
				},
				height: 'auto'
			});
		});

	});
};

/**
 *	Template - cards_tumblr_photo
 *	Helpers
 */
Template['cards_tumblr_photo'].helpers({
	/**
	 *	Extracting the photos
	 */
	images: function() {
		if(Helpers.checkNested(this, 'photos')) {
			return this.photos;
		}
	}
});