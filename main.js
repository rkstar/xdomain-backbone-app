// this file is our entry-point to the application.
//
// here we will configure require.js and load in our initial dependencies.

// Require.js allows us to configure shortcut alias
// NOTE:
// the paths configured here will be RELATIVE to the file in the data-main
// attribute of the script tag that loads require.js!
// we're using data-main="js/main" which means everything is relative to
// the "js" directory.
// also -- we will again OMIT the ".js" on the end of our file paths.. require.js
// adds those for us.
require.config({
	// paths to required javascript files
	paths : {
		// libraries
		jquery : "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
		base  : "js/lib/base.application-0.7.5.min",
		underscore : "js/lib/underscore-1.4.4.min",
		toolbox  : "js/lib/toolbox.min",
		json2 : "js/lib/json2.min",
		hogan : "js/lib/hogan.min",
		hgn : "js/lib/hgn-fudge.min",
		error : "js/lib/error",
		i18n : "i18n"
	},

	// "shim" will allows us to load in deps synchronously so that we do not
	// run into a situation where dependencies are not available
	shim : {
		underscore : { exports : "_" },
		json2		: { exports : "JSON" },
		jquery	: {
			exports : "$",
			init : function(){ return this.jQuery.noConflict(); }
		},
		toolbox : {
			deps : ["underscore", "jquery"],
			exports : "Toolbox"
		},
		base : { deps : ["underscore", "jquery", "toolbox"] }
	}
});

//////////////////////// START THE APPLICATION //////////////////////////
// now that require.js is configured, we will load our app definition!
require([ "underscore", "jquery", "application" ], function( _, $, Application ){
	var el,
		language,
		path,
		applicationUrl,
		scripts = document.getElementsByTagName('script');
	_.each(scripts, function(script){
		if( script.getAttribute("data-main") )
		{
			el = script;
			language = el.getAttribute("data-lang").toLowerCase();
			path = el.getAttribute("data-main").split("/");
			path.pop();
			applicationUrl = path.join("/");
		}
	});
	// load the app module and pass it to our definition function
	// the "application" module is passed in as "Application".
	new Application(el, language, applicationUrl);
});
