/**
 *	Template - seo_layout
 */
SSR.compileTemplate('seo_layout', Assets.getText('seo_templates/layout.html'));

/**
 *	Template - layout
 *	Helpers
 */
Template.seo_layout.helpers({
	/**
	 *	@method getDocType
	 *	@return {String} - the doctype
	 */
	getDocType: function() {
		return '<!DOCTYPE html>';
	}
});