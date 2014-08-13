define([ "underscore", "jquery", "toolbox" ],
function( _, $, Toolbox ){
	return Toolbox.Base.extend({
		constructor : function( scriptElement, language, applicationUrl, callback ){

			this.scriptElement = scriptElement;
			this._action.childInitFunction = callback;

			// determine the language
			// this.language = ($(scriptElement).attr("data-lang").toLowerCase()=="fr") ? "fr" : "en";
			this.language = (language=="fr") ? "fr" : "en";

			// get and set the application URL for this app
			// var path  = $(scriptElement).attr("data-main").split("/");
			// 	path.pop();
			// this.applicationUrl = path.join("/");
			this.applicationUrl = applicationUrl;

			// parse the URI and send important information about this app and the end-user
			// back to the server for analytics
			this._parseURI();

			// create our default style sheet and
			// insert it into the DOM after our script tag
  			var css = document.createElement("link");
  				css.setAttribute("href", this.getCSS());
  				css.setAttribute("type", "text/css");
  				css.setAttribute("rel", "stylesheet");
			// ripped straight outta compton (aka backbone.js)
  			this.styleElement = css;
  			this.scriptElement.parentNode.insertBefore(this.styleElement, this.scriptElement.nextSibling);


			// create the main application container and
			// insert it into the DOM
			var el = document.createElement(this.tagName);
				el.setAttribute("id", this.id);
				el.setAttribute("data-lang", this.language);
			// ripped straight outta compton (aka backbone.js)
			this.$el = $(el);
			this.el  = this.$el[0];
			this.scriptElement.parentNode.insertBefore(this.el, this.styleElement.nextSibling);

			// check to see if we're launched and/or expired
			// check expired first... more important
			this._expired(function( hasExpired ){
				if( hasExpired )
				{
					return (typeof this.renderExpired !== "undefined")
							? this.renderExpired.call(this)
							: this._action.expired.call(this);
				}
				this._launched(function( hasLaunched ){
					if( !hasLaunched )
					{
						return (typeof this.renderPrelaunch !== "undefined")
								? this.renderPrelaunch.call(this)
								: this._action.unlaunched.call(this);
					}
					// we are good to go....
					this._action.childInitFunction.call(this);
				});
			});

			this._sendAnalytics();
		},

		//
		// "public" functions
		//
		ajax : function(){
			var opts = _.extend({
				url : "",
				cache : false,
				data : {},
				dataType : "jsonp",
				crossDomain : true,
				onComplete : function(response){}
			}, arguments[0] || {});
			var context = arguments[1] || null;

			// sanity!
			opts.url = (opts.url.substr(0,4).toLowerCase()==="http")
						? opts.url
						: this.applicationUrl+opts.url;
			// send data to server
			$.support.cors = true;
			$.ajax(opts).done(function( response ){
				(context)
					? opts.onComplete.call(context, response)
					: opts.onComplete(response);
			});
		},

		token : "cfir0xng071mrewe9tcd6ce1r44acwzo",
		applicationData : {
			domain : "",
			subdomain : "",
			hostname : ""
		},
		timeCheckUrl : "https://a.irmil.es/cdn/time.php",
		analyticsUrl : "https://a.irmil.es/api/analytics/1.0/atg",
		applicationUrl : "/",
		applicationCSS : {
			en : "/css/main.css",
			fr : "/css/main.fr.css"
		},
		getCSS : function(){
			if( !this.applicationCSS ) { return; }
			var file = (typeof this.applicationCSS==="object" )
						? this.applicationCSS[this.language]
						: this.applicationCSS;
			return (file.substr(0,4).toLowerCase()==="http")
				? file
				: this.applicationUrl+file;
		},
		
		// scriptElement : undefined,
		// styleElement : undefined,

		tagName : "div",
		id : "fapp",
		// el : undefined,

		// template : undefined,
		// template_prelaunch : undefined,
		// template_expired : undefined,

		errorcode : {
			ok : 0,
			error : -1,
			invalid : -2,
			ineligible : -3
		},

		autoreload : true,

		// these are date strings or javascript date objects
		// to be set in the application.js file which will
		// define when to launch and expire the application
		// leave these null if your app does not require
		// this functionality.
		// expires : undefined,
		// launches : undefined,
		// expireDate : undefined,
		// launchDate : undefined,

		// the attributes object stores all "attributes" or "properties"
		// to be used in the application templates.  this is borrowed
		// directly from the backbone.js philosophy of encapsulating
		// model data outside of logic.
		// toJSON and toString functions will action the attributes object
		attributes : {},
		toJSON : function(){ return this.attributes; },
		toString : function(){ return JSON.stringify(this.attributes); },

		// use set and get to deal with the application attributes object.
		// you can modify attributes directly, but using this function
		// allows the base application to be upgraded without having to modify
		// application code later on.  it also allows sanitization of attributes
		// before they go into production
		set : function( name, value ){
			this.attributes = this.attributes || {};

			if( _.isObject(name) )
			{
				var vars = name;
				var self = this;
				_.each(_.keys(vars), function(key){ self.attributes[key] = vars[key]; });
			}
			else { this.attributes[name] = value; }
		},
		get : function( name ){ return this.attributes[name]; },

		// render looks for beforeRender and afterRender functions and executes
		// those when they are defined and are functions.  override this function
		// only in extreme cases.  this will take your underscore template file
		// and add it to the container element using this.toJSON() to get the
		// attribute data to be parsed into the template
		render : function(){
			// run before rendering...
			if( typeof this.beforeRender === "function" ) { this.beforeRender(); }

			this.el.innerHTML = this.template(this.toJSON());

			// run after rendering...
			if( typeof this.afterRender === "function" ) { this.afterRender(); }

			return this;
		},

		// the language attribute for this application
		// this is set at runtime, default:en
		language  : "en",

		// uri object provides an easy way to interact with any variables passed to
		// your application via the URI.  use this.uri.<myurivar> to access these values
		// uri : undefined,

		// tell our application which URI vars we're expected to get as encrypted values
		// uriExceptions : undefined,


		//
		// "private" functions
		//

		// resets our application display and runs through the application startup
		// process again without reloading the page
		_resetConstructor : function(){
			this.$styleElement.remove();
			this.$el.remove();
			this.constructor(this.scriptElement, this._action.childInitFunction);
		},

		// default action items for loading a prelaunch and postexpire template
		// vs. the default application template file
		_action : {
			childInitFunction : function(){},
			expired : function(){
				if( (typeof this.template_expired !== "undefined")
				&& (this.template_expired != null) )
				{
					if( (typeof this.template_expired === "object") 
						&& this.template_expired.en )
					{
						this.template = ((this.language == "fr")
										&& this.template_expired.fr)
										? this.template_expired.fr
										: this.template_expired.en;
					}
					else { this.template = this.template_expired; }
					// render it!
					this.render();
					return;
				}
				// no template...
				window.location.href = window.location.origin	// modern browsers
									|| window.location.protocol+"//"+window.location.hostname;	// ie.
			},
			unlaunched : function(){
				if( (typeof this.template_prelaunch !== "undefined")
				&& (this.template_prelaunch != null) )
				{
					if( (typeof this.template_prelaunch === "object")
						&& this.template_prelaunch.en )
					{
						this.template = ((this.language == "fr")
										&& this.template_prelaunch.fr)
										? this.template_prelaunch.fr
										: this.template_prelaunch.en;
					}
					else { this.template = this.template_prelaunch; }
					// render it!
					this.render();
					return;
				}
				// no template...
				window.location.href = window.location.origin	// modern browsers
									|| window.location.protocol+"//"+window.location.hostname;	// ie.
			}
		},

		// compares a date/time for launch and expire of the application to a server time
		// which is gathered at startup (if required)
		// _expired and _launched run their checks and fire a callback function provided
		// as a parameter
		_serverTime : 0,
		_getServerTime : function(){
			var callback = arguments[0];
			var context  = (arguments[1]) ? arguments[1] : null;
			var self = this;
			this.ajax({
				url : this.timeCheckUrl,
				onComplete : function( response ){
					self._serverTime = (typeof response === "object")
						? parseInt(response.timestamp)
						: response.timestamp;
					// call the callback
					(context)
						? callback.call(context)
						: callback();
				}
			});
		},

		_expired : function( callback ){
			if( (typeof this.expires == 'undefined')
			 || !this.expires
			 || (this.expires.length < 1) )
			{
				callback.call(this, false);
				return;
			}
			// parse this.expires
			// accepts:
			// {
			// 	date: <date_string | date_object | js_date_object>,
			// 	time: <time_string | time_object | js_date_object>
			// }
			// date : 
				// 17 apr(il) 1978
				// april 17, 1978
				// april 17 1978
				// 17 04 1978
				// 17.04.1978
				// 1978 04 17
				// 1978-04-17
				// { year:1978, month:4, day:17 }
			// time :
				// 11:59 pm
				// 23:59
				// { hour:11|23, minute:59, ampm:"pm" }
			this.expireDate = (this.expires instanceof Date) ? this.expires : this._parseDateTime(this.expires);
			if( !this._serverTime )
			{
				var self = this;
				this._getServerTime(function(){
					self._expiredOnComplete.call(self, callback);
				});
			}
			else
			{
				this._expiredOnComplete(callback);
			}
		},
		_expiredOnComplete : function( callback ){
			// MAKE SURE we use "call" on the callback to keep
			// the context of "this" in our application class
			callback.call(this, (this._serverTime > this.expireDate.valueOf()));
		},

		_launched : function( callback ){
			if( (typeof this.launches == 'undefined')
			 || !this.launches
			 || (this.launches.length < 1) )
			{
				callback.call(this, true);
				return;
			}
			// parse this.launches
			// accepts:
			// {
			// 	date: <date_string | date_object | js_date_object>,
			// 	time: <time_string | time_object | js_date_object>
			// }
			// date : 
				// 17 apr(il) 1978
				// april 17, 1978
				// april 17 1978
				// 17 04 1978
				// 17.04.1978
				// 1978 04 17
				// 1978-04-17
				// { year:1978, month:4, day:17 }
			// time :
				// 9:00 am
				// 09:00
				// { hour:9, minute:00, ampm:"am" }
			this.launchDate = (this.launches instanceof Date) ? this.launches : this._parseDateTime(this.launches);
			if( !this._serverTime )
			{
				var self = this;
				this._getServerTime(function(){
					self._launchedOnComplete.call(self, callback);
				});
			}
			else
			{
				this._launchedOnComplete(callback);
			}
		},
		_launchedOnComplete : function( callback ){
			// MAKE SURE we use "call" on the callback to keep
			// the context of "this" in our application class
			var diff = this.launchDate.valueOf() - this._serverTime;
			callback.call(this, (diff < 1));

			// check for auto reload and set a timeout to reload the page
			// once it's live
			if( this.autoreload && (diff > 0) )
			{
				var self = this;
				setTimeout(function(){
					self._resetConstructor.call(self);
				}, diff);
			}
		},

		// these dates parse various formats of date strings into a date object
		// and returns it
		_dates : {
			months : {
				abbr : ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
				full : ["january","february","march","april","may","june","july",
				        "august","september","october","november","december"]
			}
		},
		_parseDateTime : function( thing ){
			var ii, hh, dd, mm, yyyy;
			if( typeof thing === "object" )
			{
				yyyy = thing.year;
				mm = thing.month;
				dd = thing.day;
				hh = ((thing.hour < 12) && thing.ampm && (thing.ampm.toLowerCase()=="pm"))
					? thing.hour + 12
					: thing.hour;
				hh = ((hh === 12) && thing.ampm && (thing.ampm.toLowerCase()=="am")) ? 0 : hh;
				ii = thing.minute;
			}
			else
			{
				var date = thing;
					date = date.replace(/,/g, "");
					date = date.replace(/\./g, " ");
					date = date.replace(/-/g, " ");
					date = date.replace(/:/g, " ");
				var parts = [];
				_.each(date.split(" "), function(p){
					var i = parseInt(p),
						e = isNaN(i) ? p : i;
					parts.push(e);
				});
				// look for which part is first
				if( isNaN(parts[0]) )
				{
					mm = parts[0].toLowerCase();
					dd = parts[1];
					yyyy = parts[2];
				}
				else if( !isNaN(parts[0]) && (parts[0].length === 4) )
				{
					yyyy = parts[0];
					mm = parts[1];
					dd = parts[2];
				}
				else
				{
					dd = parts[0];
					mm = parts[1];
					yyyy = parts[2];
				}

				// parse the time portion out
				hh = ((parts[3] < 12) && parts[5] && (parts[5].toLowerCase()=="pm")) ? parts[3] + 12 : parts[3];
				hh = ((hh === 12) && thing.ampm && (thing.ampm.toLowerCase()=="am")) ? 0 : hh;
				hh = hh || "00";
				ii = parts[4] || "00";
			}

			// now we have to make SURE that we have a "number" month...
			if( isNaN(mm) )
			{
				mm = (_.indexOf(this._dates.months.abbr, mm.toLowerCase()) > -1)
						? _.indexOf(this._dates.months.abbr, mm.toLowerCase())
						: _.indexOf(this._dates.months.full, mm.toLowerCase());
			}
			else { mm--; }

			return new Date(yyyy, mm, dd, hh, ii);
		},

		// parses the request URI into a usable javascript object at this.uri
		// in order to allow those variables to be easily accessible in our application
		_parseURI : function(){
			// store the URL information in this.applicationData
			this.applicationData.hostname = window.location.host;
			var parts = this.applicationData.hostname.split(".");
			this.applicationData.subdomain = "";
			while( parts.length > 2 ) { this.applicationData.subdomain += parts.shift(); }
			this.applicationData.domain = parts.join(".");

		    this.uri  = this.uri || {};
		    // var query = window.location.search.substr(1).replace(/\+/g, " ");
		    var query = window.location.search.substr(1);
		    var args  = query.split("&");
		    var i, n, argn, key, value;
		    while( n = args.shift() )
		    {
		    	// split doesn't work like PHP, so we kind of have to fake it
		    	argn  = n.split("=");
		    	key   = argn.shift();
		    	value = argn.join("=");
	    		// only add elements that have a value
		    	if( value.length > 0 )
		    	{
		    		this.uri[key] = (_.isArray(this.uriExceptions) && _.indexOf(this.uriExceptions, value))
		    						? value
		    						: value.replace(/\+/g, " ");
		    	}
		    }

		    return this.uri;
		},

		// gathers and sends analytics about our application
		// to our web services api for storage.
		_sendAnalytics : function(){
			// send it!
			this.ajax({
				url  : this.analyticsUrl,
				data : {
					token : this.token,	// use app token, or default
					uri : JSON.stringify(this.uri),
					domain : this.applicationData.domain,
					subdomain : this.applicationData.subdomain,
					language  : this.language
				}
			});
		}
	});
});