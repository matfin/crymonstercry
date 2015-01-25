Package.describe({
	summary: 'Slider library for fast and smooth sliding on mouse, touch events.',
	version: '0.0.1',
	name: 'slider'
});

Package.onUse(function(api) {	

	/**
	 *	Adding source files for this package (client)
	 */
	api.addFiles([
		'_src/customEvent.js',
		'_src/slider.js'
	], 'client');

	/**
	 *	Exporting package classes so they can be access from anywhere within the app.
	 */
	api.export('Slider');

});