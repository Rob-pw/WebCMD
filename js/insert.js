var option = function(id, message, yes, no) { 
	if(!yes && !no) {
		this.isTerminal = true;
	}
	this.id = id;
	this.message = message;
	this.yes = yes;
	this.no = no;
};

function Quiz() {
	this.questions = [
	new option(0, "Will it hurt?", 5, 1),
	new option(1, "Will it provide you with pleasure?", 2, 7),
	new option(2, "Is it illegal?", 3, 8),
	new option(3, "Is it a small child, or a hamster?", 4, 12),
	new option(4, "You should probably avoid doing this."),
	new option(5, "Is it a cactus?", 4, 6),
	new option(6, "Will it rip you open like a fat kid attacking a packet of Doritos?", 4, 1),
	new option(7, "Are you curious about how it feels?", 8, 9),
	new option(8, "GO FOR IT, MY SON!"),
	new option(9, "Ahh, no point."),
	new option(10, "Is it illegal?", 11, 8),
	new option(11, "Is it a small child, or a hamster?", 4, 12),
	new option(12, "Would it have detrimental consequences on your social standing? OR Would it cause the third world war?", 4, 8)];
	this.Init();
};

Quiz.prototype.Init = function() {
	KONSOLE.sys.WriteLine("Welcome to the 'Should I insert it into me?' decision assistance platform.");
	KONSOLE.sys.WriteLine("Respond to the following questions with either 'Yes' or 'No' answers.");
	KONSOLE.sys.WriteLine();
	this.AskQuestion();
};

Quiz.prototype.AskQuestion = function(question) {
	if(this.questions.length == 0) {
		KONSOLE.sys.WriteLine("ERR: No Questions");
		return null;
	}
	if(!question) {
		question = this.questions[0];
	}
	if(question.isTerminal) {
		KONSOLE.sys.WriteLine(question.message);
		return false;
	}
	else {
		var self = this;
		KONSOLE.sys.ReadLine(question.message, function(response) {
			response = response.toLowerCase();
			KONSOLE.sys.WriteLine(response, 'info');
			self.AskQuestion(self.questions[question[response]]);
		});
	}
}

KONSOLE.sys.plugins.quiz = Quiz;