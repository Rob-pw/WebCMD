KONSOLE.sys = {
		curPos: 0, 
		command: "",
		curCommand: 0,
		commandHistory: [],
		supressNext: false,
		blinker: $('div#blinker') || document.getElementById('blinker')
};

KONSOLE.sys.moveToCommand = function(places) {
	var gotCommand,
		newCurCommand = this.curCommand + places,
		maxCurCommand = this.commandHistory.length;
	if(newCurCommand < maxCurCommand) {
		if(newCurCommand > 0) {
			this.curCommand += places;
		}
		else {
			this.curCommand = 0;
		}
	}
	else {
		this.curCommand = maxCurCommand;
	}

	gotCommand = this.commandHistory[this.curCommand];

	if(gotCommand) {
		this.command = gotCommand;
		$('pre.inputText').innerText = this.command;
	}

	this.moveCursor(this.command.length);
};

KONSOLE.sys.writeLine = function (toPrint, level, endWithNewLine) { 
	if(typeof level === "boolean") {
		endWithNewLine = level;
		level = undefined;
	}

	if(level) {
		switch(level) {
			case 'info': 
				toPrint = "> " + toPrint;
				break;
			case 'warning':
				toPrint = "[WARNING]: " + toPrint;
				break;
			case 'error':
				toPrint = "[ERROR]: " + toPrint;
				break;
		}
	}
	
	if(toPrint) {
		if (typeof toPrint === "object") {
			toPrint = JSON.stringify(toPrint, null, "\t");
		}

		$('.output').innerHTML += "<pre>" + toPrint + "</pre>";
	}

	if(!toPrint || endWithNewLine) {
		$('.output').innerHTML += "<br/>";
	}

	window.scrollTo(0, document.body.scrollHeight);
};

KONSOLE.sys.readLine = function(msg, defaultValue) {
	if(!defaultValue){ 
		defaultValue = "";
	}
	
	this.writeLine(msg);
	if(typeof defaultValue == 'function') {
		this.supressNext = true;
		document.addEventListener("lineRead", function lineRead(e) {
			var message = e.detail;

			document.removeEventListener("lineRead", lineRead);
			KONSOLE.sys.supressNext = false;
			defaultValue(message);
			KONSOLE.sys.clearInput();
		});
	}
	else {
		var response = prompt(msg, defaultValue).toLowerCase();
		if(response) {
			this.writeLine("> " + response);
		}
		return response;
	}
};

KONSOLE.sys.clearInput = function() {
	KONSOLE.sys.command = $('pre.inputText').innerText = "";
};

KONSOLE.sys.exec = function(command) {
	var argumentArray = command.split(' '),
		commandToExec = {
			command: argumentArray[0].toLowerCase(),
			args: argumentArray.splice(1, argumentArray.length)
		},
		toReturn, 
		sys = KONSOLE.sys, 
		commandPlugin = sys.plugins[commandToExec.command];
	this.commandHistory.push(commandToExec.command + " " + commandToExec.args.join(' '));
	this.curCommand = this.commandHistory.length;
	if(this.command) {
		this.writeLine($('span.loginName').innerText + this.command);
	}

	if(commandPlugin) {
		try{
			toReturn = new commandPlugin(commandToExec.args);
		} catch (ex) {
			sys.writeLine(ex.message, "error");
		}
	}
	else {
		try {
			eval(sys.command);
		} catch (ex) {
			sys.writeLine("'" + sys.command + "' is not recognised as an internal or external command,");
			sys.writeLine("operable program or Javascript file.", true);
		}
	}
	sys.clearInput();
	sys.moveCursor(0);
	return toReturn;
};

KONSOLE.sys.moveCursor = function(places) {
	var sys = KONSOLE.sys;
	var result = sys.curPos + places;
	if(result > sys.command.length)
	{
		result = sys.command.length;
	}
	if(result < 0) {
		result = 0;
	}
	sys.curPos = result;
	sys.blinker.style['margin-left'] = (-4 + (sys.command.length - sys.curPos) * -8) + "px";
};

KONSOLE.sys.toggleBlinker = function() {
	var sys = KONSOLE.sys, opacity = sys.blinker.style.opacity;
	if(opacity == "0") {
		sys.blinker.style.opacity = 1;
	}
	else if(opacity == "1" || opacity == "") {
		sys.blinker.style.opacity = 0;
	}
};

KONSOLE.sys.changeUser = function(newUser) {
	$('span.loginName').innerText = 'C:\\Users\\' + newUser + '>';
};

KONSOLE.ns('sys.plugins.info', function() { 
	var lib = this;
	if(!this.writeLine) {
		lib = KONSOLE.sys;
	}
	lib.writeLine("Microsoft Windows [Version 6.2.9200]");
	lib.writeLine("(c) 2012 Microsoft Corporation. All rights reserved.", true);
});

KONSOLE.sys.plugins.title = function(title) {
	$('title').innerHTML = title.join(' ');
	KONSOLE.sys.writeLine();
};

KONSOLE.sys.plugins.cls = function () {
	$('div.output').innerHTML = "<br/>";
};

KONSOLE.sys.plugins.help = function() {
	var sys = KONSOLE.sys;
	sys.writeLine("For more information on a specific command, type HELP command-name");
	for (var plugin in sys.plugins ) {
		if(sys.plugins.hasOwnProperty(plugin)) {
			sys.writeLine(plugin.toUpperCase());
		}
	};
	sys.writeLine();
};

KONSOLE.sys.plugins.test = function() {
	KONSOLE.sys.readLine("I will write what you say next.", function(message) {
		KONSOLE.sys.writeLine(message, 'info', true);
	});
};

KONSOLE.sys.plugins.about = function() {
	var sys = KONSOLE.sys;
	sys.writeLine(JSON.stringify(KONSOLE.info, null, "\t"), true);
};

KONSOLE.sys.plugins.exit = function() {
	window.location = "/"; //120
};

(function() {
	KONSOLE.sys.exec("Info");
	document.addEventListener('commandEntered', function(e) {
		var message = e.detail;

		if(KONSOLE.sys.supressNext == false) {
			KONSOLE.sys.exec(message);
		}
		else {
			$.trigger(document, "lineRead", message);
		}
	});
	console.log = KONSOLE.sys.writeLine;
	setInterval(KONSOLE.sys.toggleBlinker, 500);
	KONSOLE.sys.changeUser("Offline-Temp")
})();