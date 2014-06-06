(function() {
	var FileManager = (function() {
		var fileSystem = {};
		var fileSystem_1 = {
			'c:': {
				'Program Files' : {

				},
				'Windows' : {

				}
			}
		};

		function createDirectory(dirPath) {
			var components = dirPath.split('\\'),
				rootDrive,
				i = 1,
				max = components.length,
				currentDir;
			if(components[0].search(':') === 1 && components[0].length === 2) { //TODO: Regex valid drive name check.
				rootDrive = fileSystem[components[0]];
				if(!rootDrive) {
					rootDrive = new Drive(components[0]);
				}
			}
			for(; i < max; i += 1) {
 				if(!currentDir) {
 					currentDir = 
 				}
			}
		}

		function Directory(dirName) {
			this.isDirectory = true;
			if(typeof dirName === "string") {
				this.name = dirName;
			}
			this.children = [];
		}

		function Drive(name) {
			this.name = name;
		}

		function addDirectories(directories) {
			var i = 0,
				max,
				currentDir;
			if(directories) {
				max = directories.length;
				for(; i < max; i += 1) {
					currentDir = directories[i];
					if(currentDir instanceof Directory) {
						this[currentDir.name] = currentDir;
					}
				}
			}
		};
	})();

})();