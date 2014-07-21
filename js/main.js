var KONSOLE = KONSOLE || new function() {
	this.ns = function(ns_string, object) {
		if(!ns_string) {
			console.log("Namespace cannot be blank");
			return null;
		}
		var parts = ns_string.split('.'),
			parent = KONSOLE,
			max = parts.length,
			toSet;

		if(parts[0] === "KONSOLE") {
			parts = parts.slice(1);
		}

		for(var i = 0; i < max; i++) {
			if(typeof parent[parts[i]] === "undefined") {
				if(object && (i === max - 1)) {
					toSet = object;
				}
				else {
					toSet = {};
				}
				parent[parts[i]] = toSet;
			}
			parent = parent[parts[i]];
		}

		return parent;
	};
};

KONSOLE.info = {
	author: "Robert P. White",
	website: "http://rob.pw",
	copyright: "Rob.pw, all rights reserved."
};

KONSOLE.ns('client');

var $ = $ || function(elementSelector) {
	var elements = document.querySelectorAll(elementSelector);
	
	if(elements.length == 1) {
		elements = elements[0];
	}

	return elements;
};

$.css = function(element, selector, value) {
	element = (typeof element === "string") ? $(element) : element;

	var styles = element.style
	,	selectorParts = selector.split('-')
	,	max = selectorParts.length
	,	newSelector = selectorParts[0]
	,	style;

	for(var i = 1; i < max; i += 1) {
		var part = selectorParts[i];
		newSelector += part[0].toUpperCase() + part.substring(1);
	}

	style = styles[newSelector];

	if(style && !value) {
		return style;
	}

	styles[newSelector] = value;
	return (styles[newSelector] == value);
};

$.trigger = function(element, eventName, arguments) {
	arguments = (typeof arguments === "string") ? { "detail": arguments } : arguments;

	var event = new CustomEvent(eventName, arguments);
	element.dispatchEvent(event);
};