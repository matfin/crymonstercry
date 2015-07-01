/**
 *	Template - views_photos
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['views_photos'].created = function() {
	this.total = App.collections.in_images.find({}).count();
	this.offset = this.data.images.length;
	this.limit = this.offset + 30;
	var self = this;

	/**
	 *	This tracker is fired when the user has scrolled to the 
	 *	bottom of the window. 
	 *	We need this to go and fetch more images from the collection.
	 */
	this.scrollTracker = Tracker.autorun(function() {

		/**
		 *	This function is dependent on the scrolledbottom,
		 *	so when the user reaches the bottom of the page,
		 *	this function it called automatically.
		 */
		App.dependencies.scrolledbottom.depend();

		/**
		 *	If the offset is greater than the number of images in the server
		 *	side collection, we know we have fetched all the images.
		 */
		if(self.offset > self.total) {
			document.getElementById('loadingmore').className = 'loadingmore hidden';
		}
		
		/**
		 *	Subscribe to the in_images collection with the offset and limit
		 *	params to call more images from the server.
		 */
		Meteor.subscribe('in_images', self.offset, self.limit, function() {

			/**
			 *	Or we increate the offsets and limits and update the image count.
			 */
			self.total = App.collections.in_images.find({}).count();
			self.offset += 30;
			self.limit += 30;	
	
		});
			
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
