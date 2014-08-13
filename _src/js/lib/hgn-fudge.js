/**
 * @license Hogan Plugin | v0.2.1 (2013/02/08)
 * Author: Miller Medeiros | MIT License
 * Modified by: David Fudge | MIT License (2013/05/24)
 */
define(["hogan"], function( hogan ){

	// set up some default config here
	var defaults = {
		extension : ".html",
		directory : "templates/"
	};

	var _build = {
		map : {},
		templateText : 'define("{{pluginName}}!{{moduleName}}", ["hogan"], function(hogan){'+
					'  var tpl=new hogan.Template({{{fn}}}, "", hogan);'+
					// need to use apply to bind the proper scope
					'  function render(){ return tpl.render.apply(tpl, arguments); } '+
					'  render.template=tpl; return render; });\n',
		template : null
	};

	function load( name, req, onLoad, config )
	{
		var cfg = config.hgn || {};
		var filepath  = (cfg && (cfg.templateDirectory != null))
						? cfg.templateDirectory
						: defaults.directory
			filepath += name;
			filepath += (cfg && (cfg.templateExtension != null))
						? cfg.templateExtension
						: defaults.extension;

		var fromUrl = inBrowser();
		var url     = (fromUrl) ? req.toUrl(filepath) : config.baseUrl+filepath;
		fetchText( url, fromUrl, function(data){
			var options = cfg.compilationOptions
							? mixIn({}, cfg.compilationOptions)
							: {};

			if( config.isBuild )
			{
				// store the compiled function if build and s hould always be a string
				options.asString = true;
				_build.map[name] = hogan.compile(data, options);
			}

			// return the compiled template
			var template = hogan.compile(data, options);
			var render   = bind(template.render, template);
			// add text property for debugging
			// it's importa to notice that this value won't be available after build
			render.text  = template.text;
			render.template = template;

			onLoad(render);
		});
	}

	function fetchText( filepath, fromUrl, callback )
	{
		if( fromUrl )
		{
			var xhr,
				msie = getIEVersion();
			if( (msie >= 7) )//&& (msie < 10) )
			{
				// do some diggin' to make sure IE 7-9 doesn't CHOKE
				// on this bit of trickery.
				//
				// XDomainRequest NEEDS to make sure that content is served
				// from the same scheme as the calling domain.  this means that
				// if you're calling from http:// your file must be called from
				// http:// and the same goes for https://
				//
				// so let's give'r
				var protocol = filepath.substr(0, filepath.indexOf(":")+1);
					filepath = (protocol != window.location.protocol)
								? filepath.replace(protocol, window.location.protocol)
								: filepath;

				xhr = getTransport(true);
				xhr.open('GET', filepath);
				xhr.onload = function(){ callback(xhr.responseText); };
				// you need these set too
				xhr.onprogress = xhr.ontimeout = xhr.onerror = function(){};
				setTimeout( function(){ xhr.send(); }, 0 );
			}
			else
			{
				xhr = getTransport();
				xhr.open('GET', filepath, true);
				xhr.onreadystatechange = function (evt) {
				    //Do not explicitly handle errors, those should be
				    //visible via console output in the browser.
				    if (xhr.readyState === 4) {
				        callback(xhr.responseText);
				    }
				};
				xhr.send(null);
			}
		}
		else
		{
			var body = fs.readFileSync(filepath, 'utf8') || "";
				body = body.replace(/^\uFEFF/, '');  // we need to remove BOM stuff from the file content
			callback(body);
		}
	}

	function getIEVersion()
	{
		var rv = -1;
		if( window.navigator.appName == "Microsoft Internet Explorer" )
		{
			var ua = window.navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				rv = (re.exec(ua) != null) ? parseFloat(RegExp.$1) : rv;
		}
		return rv;
	}

	function getTransport()
	{
        //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
        var xhr, i, progId;
        if( typeof XMLHttpRequest !== "undefined" )
        {
        	return (arguments[0]===true) ? new XDomainRequest() : new XMLHttpRequest();
        }
        else
        {
        	for( i=0; i<3; i++ )
        	{
        		progId = progIds[i];
        		try {
        			xhr = new ActivXObject(progId);
        		} catch(e) {};

        		if( xhr )
        		{
        			progIds = [progId];
        			break;
        		}
        	}
        }
        if( !xhr ) { throw new Error("getTransport(): XMLHttpRequest not available."); }

        return xhr;
	}

	function bind( fn, context )
	{
		return function(){
			return fn.apply(context, arguments);
		};
	}

	function mixIn( dst, src )
	{
		for( var n in src )
		{
			if( Object.prototype.hasOwnProperty.call(src, n) ){ dst[n] = src[n]; }
		}

		return dst;
	}

	function write( pluginName, moduleName, writeModule )
	{
		if( moduleName in _build.map )
		{
			if( !_build.template )
			{
				// using templates to generate compiled templates, so meta :P
				_build.template = hogan.compile( _build.templateText );
			}
		}

		var fn = _build.map[moduleName];
		writeModule( _build.template.render({
			pluginName : pluginName,
			moduleName : moduleName,
			fn : fn
		}));
	}

	function inBrowser()
	{
		return(
			(typeof window !== "undefined")
			&& window.navigator
			&& window.document
			&& (!window.navigator.userAgent.match(/Node.js/))
		);
	}

	return {
		load  : load,
		write : write
	};
});