/**
 *	Template - seo_tour 
 */
SSR.compileTemplate('seo_tour', Assets.getText('seo_templates/views/tour.html'));

/**
 *	Template - seo_tour
 *	Helpers
 */
Template.seo_tour.helpers({
	formattedDate: function(timestamp, format) {
		return Helpers.formattedDate(timestamp, format);
	}
});