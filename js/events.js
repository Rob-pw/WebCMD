KONSOLE.ns('events.handlers', {
	keyHandler: function keyHandler(keyCode) {
		var sys = KONSOLE.sys, command = sys.command;
		switch(keyCode) {
			case 8:
				sys.command = command.substring(0, sys.curPos - 1) + command.substring(sys.curPos);
				$('pre.inputText').innerText = sys.command;
				sys.moveCursor(-1);
			break;

			case 37: //Left
				sys.moveCursor(-1);
			break;

			case 38: //Up
				sys.moveToCommand(-1);
			break;

			case 39: //Right
				sys.moveCursor(1);
			break;

			case 40: //Down
				sys.moveToCommand(1);
			break;
			
			case 13:
				cursorAligned = false;
				$.trigger(document, 'commandEntered', command);
			break;
		}
	},
	retrieveIP : function retrieveIP(json){
		KONSOLE.client.IP = json.ip;
		
	}
});

document.onload = function() {
	$('span.loginName').innerText = 'C:\\Users\\' + KONSOLE.client.IP + '>';

	setInterval(KONSOLE.sys.toggleBlinker, 500);
};

document.onkeypress = function(e) {
	var input = $('pre.inputText'),
		sys = KONSOLE.sys;
	if(e.keyCode == 13) return;
	var character = String.fromCharCode(e.keyCode);
	if(character) {
		sys.command = sys.command.substring(0, sys.curPos) + character + sys.command.substring(sys.curPos);
		input.innerText = sys.command;
		sys.moveCursor(1);
	}
};

document.onkeydown = function(e) { 
	var keyCodesToPrevent = [8, 37, 38, 39, 40],
		i = 0,
		max = keyCodesToPrevent.length;
	for(; i < max; i += 1) {
		if(e.keyCode == keyCodesToPrevent[i]) {
			e.preventDefault();
		}
	}
	KONSOLE.events.handlers.keyHandler(e.keyCode);
};
