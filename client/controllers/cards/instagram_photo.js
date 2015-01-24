/**
 *	Template - cards_instagram_photo
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['cards_instagram_photo'].created = function() {
};

/**
 *	Template - cards_instagram_photo
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['cards_instagram_photo'].rendered = function() {
	var self = this;
	/**
	 *	Implementing lazy loading of images when this template
	 *	has beenr rendered
	 */
	this.autorun(function() {

		/**
		 *	Call the dependency depend function so
		 *	this gets fired when the user scrolls.
		 */
		App.dependencies.scrolled.depend();

		var images = self.$('img');

		$.each(images, function(index, image) {
			Helpers.lazyLoadImage(image, {
				callback: function() {
					/**
					 *	Remove the loading icon
					 */
					$(image).prev().remove();

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
 *	Template - cards_instagram_photo
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['cards_instagram_photo'].destroyed = function() {
};
