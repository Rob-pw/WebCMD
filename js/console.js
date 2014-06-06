KONSOLE.sys = {
		curPos: 0, 
		command: "",
		curCommand: 0,
		commandHistory: [],
		supressNext: false,
		blinker: $('div#blinker')[0] || document.getElementById('blinker')
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
		$('pre.inputText')[0].innerText = this.command;
	}

	this.MoveCursor(this.command.length);
};

KONSOLE.sys.WriteLine = function (toPrint, level, endWithNewLine) { 
	if(level) {
		switch(level) {
			case 'info': 
				toPrint = "> " + toPrint;
			break;
			case 'warning':
				toPrint = "[WARNING]: " + toPrint;
			break;
		}
	}
	
	if(toPrint) {
		$('.output')[0].innerHTML += "<pre>" + toPrint + "</pre>";
	}

	if(!toPrint || endWithNewLine) {
		$('.output')[0].innerHTML += "<br/>";
	}

	window.scrollTo(0, document.body.scrollHeight);
};

KONSOLE.sys.ReadLine = function(msg, defaultValue) {
	if(!defaultValue){ 
		defaultValue = "";
	}
	
	this.WriteLine(msg);
	if(typeof defaultValue == 'function') {
		this.supressNext = true;
		$(document).bind("lineRead", function(e, message) {
			$(document).unbind("lineRead");
			KONSOLE.sys.supressNext = false;
			defaultValue(message);
			KONSOLE.sys.clearInput();
		});
	}
	else {
		var response = prompt(msg, defaultValue).toLowerCase();
		if(response) {
			this.WriteLine("> " + response);
		}
		return response;
	}
};

KONSOLE.sys.clearInput = function() {
	KONSOLE.sys.command = $('pre.inputText')[0].innerText = "";
};

KONSOLE.sys.Exec = function(command) {
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
		this.WriteLine($('span.loginName')[0].innerText + this.command);
	}

	if(commandPlugin) {
		try{
			toReturn = new commandPlugin(commandToExec.args);
		} catch (ex) {
			sys.WriteLine(ex.message, "warning");
		}
	}
	else {
		try {
			eval(sys.command);
		} catch (ex) {
			sys.WriteLine("'" + sys.command + "' is not recognised as an internal or external command,");
			sys.WriteLine("operable program or Javascript file.");
			sys.WriteLine();
		}
	}
	sys.clearInput();
	sys.MoveCursor(0);
	return toReturn;
};

KONSOLE.sys.MoveCursor = function(places) {
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

KONSOLE.namespace('sys.plugins.info', function() { 
	var lib = this;
	if(!this.WriteLine) {
		lib = KONSOLE.sys;
	}
	lib.WriteLine("Microsoft Windows [Version 6.2.9200]");
	lib.WriteLine("(c) 2012 Microsoft Corporation. All rights reserved.", true);
});

KONSOLE.sys.plugins.title = function(title) {
	$('title')[0].innerHTML = title.join(' ');
	KONSOLE.sys.WriteLine();
};

KONSOLE.sys.plugins.cls = function () {
	$('div.output')[0].innerHTML = "<br/>";
};

KONSOLE.sys.plugins.help = function() {
	var sys = KONSOLE.sys;
	sys.WriteLine("For more information on a specific command, type HELP command-name");
	for (var plugin in sys.plugins ) {
		if(sys.plugins.hasOwnProperty(plugin)) {
			sys.WriteLine(plugin.toUpperCase());
		}
	};
	sys.WriteLine();
};

KONSOLE.sys.plugins.test = function() {
	KONSOLE.sys.ReadLine("I will write what you say next.", function(message) {
		KONSOLE.sys.WriteLine(message, 'info', true);
	});
};

KONSOLE.sys.plugins.about = function() {
	var sys = KONSOLE.sys;
	sys.WriteLine(KONSOLE.info.toString(), true);
};

KONSOLE.sys.plugins.exit = function() {
	window.location = "/"; //120
};

(function() {
	KONSOLE.sys.Exec("Info");
	$(document).bind('commandEntered', function(e, message) {
		if(KONSOLE.sys.supressNext == false) {
			KONSOLE.sys.Exec(message);
		}
		else {
			$(document).trigger('lineRead', message);
		}
	});
	console.log = KONSOLE.sys.WriteLine;
})();