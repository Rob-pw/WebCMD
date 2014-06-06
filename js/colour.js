KONSOLE.sys.plugins.colour = (function() {
	var colourList = {
			0: '#000000',
			1: '#000080',
			2: '#008000',
			3: '#008080',
			4: '#800000',
			5: '#800080',
			6: '#808000',
			7: '#C0C0C0',
			8: '#808080',
			9: '#0000FF',
			a: '#00FF00',
			b: '#00FFFF',
			c: '#FF0000',
			d: '#FF00FF',
			e: '#FFFF00',
			f: '#FFFFFF'
		},
		colour = function(colourCode) {
			if(!colourCode) return;
			var colourCode = colourCode[0].toLowerCase(),
				colour0 = colourCode[0],
				colour1 = colourCode[1];

			if(colourCode[0] !== colourCode[1]) {
				var backgroundColour = (colour1 ? colourList[colour0] : undefined),
					foregroundColour = (!colour1 && colour0 ? colourList[colour0] : colourList[colour1]);

				if(backgroundColour) {
					$('body').css("background-color", backgroundColour);
				}
				if(foregroundColour) {
					$('div.console').css("color", foregroundColour);
				}
			}
			KONSOLE.sys.WriteLine();
		};

	return colour;
})();