self.addEventListener('message', function(e) {
	//self.postMessage("Hello friends, I am here");
	self.postMessage(e.data);
});