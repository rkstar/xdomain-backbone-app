define([ "underscore", "jquery", "toolbox", "i18n" ],
function( _, $, Toolbox, i18n ){
	var Error = Toolbox.Base.extend({
		constructor : function(){
			this.i18n = i18n;
		},

		ERROR_OK : 0,
		ERROR_ERROR : -1,

		language : "en",
		el : null,
		msg : null,

		prefix : "error_",

		showMultipleErrors : false,
		multipleErrorFields : false,
		wasReset : false,

		errors : [],

		show : function(){
			if( this.multipleErrorFields )
			{
				_.each(this.errors, function(e){ e.el.html(e.msg).show(); });
			}
			else
			{
				this.$msg.empty().append(this.errors.shift());
				this.$el.show();
			}

			this.wasReset = false;
		},

		hide : function(){
			(this.multipleErrorFields)
				? _.each(this.errors, function(e){ e.el.hide(); })
				: this.$el.hide();
		},

		////////////////////////////////
		// 
		// the functions below should not need to be edited.  please take
		// great care when editing these functions.
		//	
		// standard errorcodes are 0 for success, non-zero for error
		reset : function(){
			this.errors = [];
			this.wasReset = true;
		},

		parseError : function(){
			var args = arguments[0]; //(arguments[0] === this.prototype) ? arguments[1] : arguments;
			var $field = (args[0]) ? args[0] : null;
			var rules  = (args[1]) ? args[1] : null;

			// sanity
			if( !$field || !rules ) { return; }

			if( !this.wasReset )
			{
				this.hide();
				this.reset();
			}

			// check to see if we're using multiple error fields
			(this.multipleErrorFields)
				? this.errors.push({
					el : $("#"+this.prefix+$field.attr("id")),
					msg : this.i18n[this.language].error[$field.attr("id")][rules[0].rule]
				  })
				: this.errors.push(this.i18n[this.language].error[$field.attr("id")][rules[0].rule]);
		}
	});
	return new Error();
});