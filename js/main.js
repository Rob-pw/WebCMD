var KONSOLE = KONSOLE || new function() {
	this.namespace = function(ns_string, object) {
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

function retrieveIP(json){
	KONSOLE.clientIP = json.ip;
}

$(function() {
	$('span.loginName')[0].innerText = 'C:\\Users\\' + KONSOLE.clientIP + '>';

	setInterval(KONSOLE.sys.toggleBlinker, 500);

	$(document)[0].onkeypress = function(e) {
		var input = $('pre.inputText')[0],
			sys = KONSOLE.sys;
		if(e.keyCode == 13) return;
		var character = String.fromCharCode(e.keyCode);
		if(character) {
			sys.command = sys.command.substring(0, sys.curPos) + character + sys.command.substring(sys.curPos);
			input.innerText = sys.command;
			sys.MoveCursor(1);
		}
	};

	$(document)[0].onkeydown = function(e) { 
		var keyCodesToPrevent = [8, 37, 38, 39, 40],
			i = 0,
			max = keyCodesToPrevent.length;
		for(; i < max; i += 1) {
			if(e.keyCode == keyCodesToPrevent[i]) {
				e.preventDefault();
			}
		}
		keyHandler(e.keyCode);
	};
});

function keyHandler(keyCode) {
	var sys = KONSOLE.sys, command = sys.command;
	switch(keyCode) {
		case 8:
			sys.command = command.substring(0, sys.curPos - 1) + command.substring(sys.curPos);
			$('pre.inputText')[0].innerText = sys.command;
			sys.MoveCursor(-1);
		break;

		case 37: //Left
			sys.MoveCursor(-1);
		break;

		case 38: //Up
			sys.moveToCommand(-1);
		break;

		case 39: //Right
			sys.MoveCursor(1);
		break;

		case 40: //Down
			sys.moveToCommand(1);
		break;
		
		case 13:
			cursorAligned = false;
			$(document).trigger('commandEntered', command);
		break;
	}
}