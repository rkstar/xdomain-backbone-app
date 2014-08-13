define([ "underscore", "jquery", "base",
		 "hgn!en/main", "hgn!fr/main" ],
function( _, $, BaseApplication,
		 template_en, template_fr ){
	var app = BaseApplication.extend({
		// this function gets run when the application is instantiated
		// use this function to set up your application
		initialize : function(){
			// set the initial template and root directory
			this.template = (this.language=="fr") ? template_fr : template_en;
			this.set({
				url : this.applicationUrl,
				truth : false
			});

			this.render();
		},

		// each application must get a token from
		// https://a.irmil.es/
		// and paste it here.  this will ensure that all analytics
		// get stored correctly and for the correct application
		//
		// this token is for docket # 036
		token : "2fwth8ae4lcldwcwcco67z0e8z3nkhvm",

		// use autoreload to tell your application what to do when someone arrives at
		// your application before it launches.  this defaults to true, and runs a
		// setTimeout on the difference in milliseconds between the current time and
		// the launch date/time as defined by your application.
		// if autoreload is true, the application will automatically load the "main" template
		// contents when the launch date/time is achieved without the user having to reload the page.
		autoreload : true,

		// these files will be loaded relative to this.applicationUrl as defined by
		// your data-main attribute of the requirejs script tag
		// alternately, you can define these with a full url
		applicationCSS : {
			en : "/css/main.css",
			fr : "/css/main.fr.css"
		},
		
		// this function will get run automatically just before this.render
		beforeRender : function(){},

		// this function will get run automatically just after this.render
		// this is the function where you should put any jQuery functionality
		// that manipulates the DOM inside your template file/s.
		afterRender : function(){},

		//////////////////////////////////////////////////
		//                                              //
		//   D O  N O T  M O D I F Y  B E L O W         //
		//                                              //
		// this is the constructor that runs when the   //
		// application is instantiated (DO NOT MODIFY). //
		// immediately after, this.initialize is run.   //
		// all code you want to run at application      //
		// start should go into this.initialize         //
		//                                              //
		//////////////////////////////////////////////////
		constructor:function(el, language, applicationUrl){
			app.__super__.constructor.call(this, el, language, applicationUrl, this.initialize);
		}
		//////////////////////////////////////////////////
		//                                              //
		//   D O  N O T  M O D I F Y  A B O V E         //
		//                                              //
		//////////////////////////////////////////////////
	});
	return app;
});