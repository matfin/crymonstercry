/**
 *	Template - components_signup
 *	Callback function called automatically when the template instance is created
 *	@method created
 *	@return undefined
 */
Template['components_signup'].created = function() {
};

/**
 *	Template - components_signup
 *	Callback function called automatically when the template instance is rendered
 *	@method rendered
 *	@return undefined
 */
Template['components_signup'].rendered = function() {
};

/**
 *	Template - components_signup
 *	Callback function called automatically when the template instance is destroyed
 *	@method destroyed
 *	@return undefined
 */
Template['components_signup'].destroyed = function() {
};

/**
 *	Template - components_signup
 *	Helpers
 */
Template['components_signup'].events({

	'click form button': function(e, template) {
		e.preventDefault();
		
		var subscriber = template.$('#email').val();


		Meteor.call('postSubscriber', {email: subscriber});
	}
});

/**
 <!-- Begin MailChimp Signup Form -->
</style>
<div id="mc_embed_signup">
<form action="//mattfinucane.us10.list-manage.com/subscribe/post?u=ba973fcd554ab453b05065330&amp;id=e41195c804" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">
	<h2>Subscribe to our mailing list</h2>
<div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
<div class="mc-field-group">
	<label for="mce-EMAIL">Email Address  <span class="asterisk">*</span>
</label>
	<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
</div>
	<div id="mce-responses" class="clear">
		<div class="response" id="mce-error-response" style="display:none"></div>
		<div class="response" id="mce-success-response" style="display:none"></div>
	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;"><input type="text" name="b_ba973fcd554ab453b05065330_e41195c804" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>
<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
<!--End mc_embed_signup-->
 */