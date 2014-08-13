# xdomain-backbone-app

Cross-domain compatible application template library based on Backbone.js

## About *xdomain-backbone-app*

*__XDBBA__* is a Javascript framework based on [**require.js**](http://requirejs.org/) that allows developers to create powerful cms page content with built-in analytics quickly and easily.

### Key Benefits

* ATG interaction is limited to one line of code; the script tag for *require.js*.
* Baked-in analytics for capturing hits and basic user and browser information available
* Templating with [**Hogan.js**](http://twitter.github.io/hogan.js/) by default allows easy abstraction of display and logic code
* Flexibile, modular architecture allows developers to add or remove modules as required
* [**r.js**](http://requirejs.org/docs/optimization.html) optimization config file included for easy compilation of project code

## Compatibility and Requirements

*__XDBBA__* uses the following technologies:

* [Require.js](http://requirejs.org/) >= v2.1.5
* [Underscore.js](http://underscorejs.org/) >= v1.4.4
* [Toolbox.js](https://github.com/jimmydo/js-toolbox)
* [Hogan.js](http://twitter.github.io/hogan.js/)
* [jQuery](http://jquery.com/)

* [Node.js](http://nodejs.org/) will have to be installed on the server in order to build your code with *__r.js__*.

## Documentation

The [Properties](#properties) and [Functions](#functions) below are available in the js/lib/base.application.js file.  These properties and functions become available in your application.js file because you will extend the base.application.js.

## Documentation Index

* [Properties](#properties)
* [Functions](#functions)
* [Customization Notes](#notes)

## Properties

#### language
> __String__ the language for your application is determined by the __data-lang__ attribute on your require.js script tag in ATG.

#### styleElement
> __DOM Element__ a reference to the main CSS DOM element added to the page.

#### scriptElement
> __DOM Element__ a reference to the require.js script DOM node.

#### el
> __DOM Element__ a reference to the container DOM element into which all application code is injected.

#### $el
> __jQuery Object__ a jQuery object of __this.el__

#### token
> __String__ the [**Squareknot REST API**](https://github.com/squareknotagency/api/) token for your application.  this is used to track analytics on your application and allow you access to encryption and validation APIs.

#### applicationData
> __Object__ an object containing *__domain__*, *__subdomain__*, and *__hostname__* of your application.  this data will be abstracted from the __window.location__ Javascript object.

#### timeCheckUrl
> __String__ the url to get the current server time from.

#### analyticsUrl
> __String__ the url to send application analytics to.

#### applicationCSS
> __Object__ | __String__ :a string or object containing paths to application CSS files relative to the *__applicationUrl__*

#### applicationUrl
> __String__ the applicationUrl is set automatically by using the __data-main__ attribute on your require.js script tag in ATG.

#### tagName
> __String__ the container element tag name (type) to use when creating the application DOM element.

#### id
> __String__ the container element's id.

#### errorcode
> __Object__ an object with default error codes to check against for simple AJAX response validation.

#### autoreload
> __Boolean__ determines whether or not to reload the page data automatically when using __prelaunch__ templates.

#### attributes
> __Object__ an object that contains all properties to be passed to templates with __this.toJSON()__ function call.  properties set with __this.set()__ are stored here.

#### _serverTime
> __Number__ a reference to server time, when it was requested, as a UNIX timestamp.

#### uri
> __Object__ an object representation of the URI.

#### uriExceptions
> __Array__ an array of properties expected in the URI to *__NOT__* parse "+" out of.

#### expires
> __Object__ | __String__ javascript date object, or string representation of the date which your application should start showing the this.template_expired template.  This property can be in the form of any of the following:
```javascript
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
```

#### launches
> __Object__ | __String__ same as __expires__ except renders this.template_prelaunch template if this._serverTime is before this date/time. This property accepts the same values as the __expires__ property.

#### template
> __Object__ a compiled [Hogan.js](http://twitter.github.io/hogan.js/) template to be rendered when calling this.render()

#### template_prelaunch
> __Object__ same as this.template, but rendered when this._serverTime < this.launches

#### template_expired
> __Object__ same as this.template, but rendered when this._serverTime > this.expires


## Functions

#### ajax( [options, context] )
> makes a JSON call and manages cross-domain dependencies as well. __options__ can include any or all of the options below, and __context__ will set the context of *this* when the onComplete function is called.
```javascript
var opts = _.extend({
	url : "",
	cache : false,
	data : {},
	dataType : "jsonp",
	crossDomain : true,
	onComplete : function(response){}
}, arguments[0] || {});
var context = arguments[1] || null;
```

#### set( object|string name [, string value] )
> sets an attribute for your application to be passed to the template when rendering. you can pass an object with many property/value pairs to set, or single parameters or name,value.

#### get( attribute_name )
> gets an attribute value.

#### toJSON()
> returns a JSON representation of this.attributes.

#### toString()
> returns a JSON string representation of this.attributes.

#### getCSS()
> returns the filepath of the current applicable main CSS file.


#### render()
> renders this.template and injects the resulting html into this.el

#### beforeRender()
> available in your application.js file, this function will run automatically just before this.render when this.render is called.

#### afterRender()
> available in your application.js file, this function will run automatically just after this.render when this.render is called.

## Customization Notes

#### Hogan.js
> I modified the hgn.js (hgn-fudge.js) file that comes with the Hogan.js package to make sure it works with XDomainRequest in IE 7/8.
> This modified hgn.js (hgn-fudge.js) file also makes considerations to allow crossdomain loading of application code.