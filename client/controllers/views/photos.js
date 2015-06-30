/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_photos'].created = function() {
	this.offset = App.collections.in_images.find({}).count();
	this.limit = this.offset + 10;
	var self = this;

	/**
	 *	This tracker is fired when the user has scrolled to the 
	 *	bottom of the window. 
	 *	We need this to go and fetch more images from the collection.
	 */
	this.scrollTracker = Tracker.autorun(function() {
		App.dependencies.scrolledbottom.depend();
		self.offset += 10;
		self.limit += 10;
		Meteor.subscribe('in_images', self.offset, self.limit);
		console.log('Fetching...', self.offset, self.limit);
	});

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
	this.scrollTracker.stop();
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
