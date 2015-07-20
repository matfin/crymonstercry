/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_photos'].created = function() {
	Session.set('photos_total', App.collections.in_images.find({}).count());
	Session.set('photos_offset', this.data.images.length);
	Session.set('photos_limit', this.data.images.length + 30);
};

/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['views_photos'].rendered = function() {
	this.slider = Slider.setup(this.$('.sliderContainer').get(0));
};

/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['views_photos'].destroyed = function() {
	delete this.slider;
};

/**
 *	Template - views_photos
 *	Helpers
 */
Template['views_photos'].helpers({

	/**
	 *	Function to get the total number of press shots
	 *	and use this to get the slider width.
	 *	
	 *	@function 	sliderWidth
	 *	@return 	{Number} - slider width as percentage
	 */
	sliderWidth: function() {
		return this.pressShots.length * 100;
	},

	/**
	 *	Should return true if photos are loading
	 *	
	 *	@function photosAreLoading
	 *	@return {Boolean} - true if the photos are loading or false
	 */
	photosAreLoading: function() {
		return Session.get('photos_loading');
	},

	/**
	 *	Should return true when all photos have been loaded
	 *	
	 *	@function allPhotosLoaded
	 *	@return {Boolean} - true if all photos from the collection have been loaded
	 */
	allPhotosLoaded: function() {
		return Session.get('photos_loaded');
	}

});

/**
 *	Template - views_photos
 *	Events
 */
Template['views_photos'].events({

	'click .paddle': function(e, template) {
		var direction = $(e.currentTarget).data('direction');
		template.slider.go(direction);
	},

	'click #loadmore': function(e, template) {
		
		Session.set('photos_loading', true);

		/**
		 *	If the offset is greater than the number of images in the server
		 *	side collection, we know we have fetched all the images.
		 */
		if(Session.get('photos_offset') > Session.get('photos_total')) {
			Session.set('photos_loaded', true);
		}

		/**
		 *	Subscribe to the in_images collection with the offset and limit
		 *	params to call more images from the server.
		 */
		Meteor.subscribe('in_images', Session.get('photos_offset'), Session.get('photos_limit'), function() {
			/**
			 *	Or we increase the offsets and limits and update the image count.
			 */
			Session.set('photos_total', App.collections.in_images.find({}).count());
			Session.set('photos_offset', Session.get('photos_offset') + 30);
			Session.set('photos_limit', Session.get('photos_limit') + 30);
			Session.set('photos_loading', false);

		});
	},

	'slidecomplete': function(e, template) {

		if(template.slider.currentSlide === 0) {
			template.$('#left').addClass('hidden');
		}
		else {
			template.$('#left').removeClass('hidden');
		}
		
		if(template.slider.currentSlide === (template.slider.slides.length - 1)) {
			template.$('#right').addClass('hidden');
		}
		else {
			template.$('#right').removeClass('hidden');
		}

	}

});
