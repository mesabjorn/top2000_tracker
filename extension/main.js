lastTick = new Date()-60000;

function SetObserver(){
	
	// selecteer de target node
	var target = document.querySelector('.playlist-item');

	// creëer een observer instantie
	var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		//console.log(mutation.type);	
		pushChanges();
	});
	});

	// configuratie van de observer instantie
	var config = {childList: true, subtree:true};

	// roep observe() aan op de observer instantie, en stuur de target node en de observer configuratie mee
	
	if(!target){
		setTimeout(SetObserver,3000);
		return -1;
	}	
	observer.observe(target, config);
	console.log("Observer started");
	return observer;
}

function pushChanges(){
	
	if((new Date()-lastTick)/1e3>60){
	
		let comp  = document.getElementsByClassName("playlist-item__artist")[0].innerText;
		let track = document.getElementsByClassName("playlist-item__track")[0].innerText;
		console.log({artist:comp,track:track});		
		
		let updates ={};
		updates['/top2000/current'] = comp + " - " + track;
		firebase.database().ref().update(updates);
		lastTick = new Date();
	}
}
observer = SetObserver();

	