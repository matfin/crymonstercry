/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_photos'].created = function() {
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
