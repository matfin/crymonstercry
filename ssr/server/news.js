/** 
 *	Template - seo_news
 */
SSR.compileTemplate('seo_news', Assets.getText('seo_templates/views/news.html'));

/**
 *	Template - seo_news
 *	Helpers
 */
Template.seo_news.helpers({
	
	formattedDate: function(timestamp, format) {
		return Helpers.formattedDate(timestamp, format);
	},

	isText: function() {
		return this.type === 'text';
	},

	isPhoto: function() {
		return this.type === 'photo';
	},

	itemAtIndex: function(collection, index) {
		return collection[index];
	}

});