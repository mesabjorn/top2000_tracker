class Top2000{
	
		constructor(){
			this.loadList("2020.json").then((d)=>{
				console.log("list loaded");
				this.r = /[\s!@#$%^&*().,-/\\\']/g;
				this.top2000 = d;

				for(let i = 0;i<this.top2000.length;i++){
					this.top2000[i]["SONGARTIST"]=this.top2000[i]["ARTIEST"]+" "+this.top2000[i]["TITEL"];
				}

				this.buildlist();
				this.startind=0;
				this.index=0;
				console.log("built list");

				this.loadList("start_track_2020.json").then((data)=>{
					this.playdate = new Date();
					//this.playdate = new Date(2020,11,30);
					if(this.playdate>new Date(2020,11,25)){
						this.startind = data[0][`${this.playdate.getDate()}-${1+this.playdate.getMonth()}-${this.playdate.getFullYear()}`];
						this.startind = this.startind == undefined? 0:this.startind-1;
						
						this.endind = data[0][`${this.playdate.getDate()+1}-${1+this.playdate.getMonth()}-${this.playdate.getFullYear()}`]-1;
	
						this.index = this.startind == undefined? 1999:2000-this.startind;
					}						
					console.log("Set search Margins");
				});
				this.getcurrent();
			});				
		}
		
		responseJson(response) {
			if (!response.ok)
			throw new Error(response.status + " " + response.statusText);
			return response.json();
		}

		async loadList(input) {
		  return new Promise((resolve, rejects) => {		  
			  
			fetch(`./data/${input}`).then(
			  (resp) => {
				console.log(`Parsing json file ${input}.`);
				this.responseJson(resp).then((d) => {
				  resolve(d);
				});
			  }
			);
		  });
		}

		async buildlist(){	
			for(let i=this.top2000.length-1;i>=0;i--){
				var main = document.createElement('div');
				main.className = "entry row";
				
				let d1 = document.createElement('div'); d1.className = "nr col-2";
				
				d1.innerText = this.top2000[i]["NR."]+".";
				
				let d2 = document.createElement('div');d2.className = "artist col-4";
				d2.innerText = this.top2000[i].ARTIEST;
				let d3 = document.createElement('div');d3.className = "track col-4";
				d3.innerText = this.top2000[i].TITEL;
				let d4 = document.createElement('div');d4.className = "year col-2";
				d4.innerText = this.top2000[i].JAAR;
				
				main.appendChild(d1);main.appendChild(d2);main.appendChild(d3);main.appendChild(d4);
				
				main.setAttribute('nr',this.top2000[i]["NR."]+".");
				main.setAttribute('artist',this.top2000[i].ARTIEST);
				main.setAttribute('track',this.top2000[i].TITEL);
				main.setAttribute('year',this.top2000[i].JAAR);
				
				main.addEventListener('click',handleClick);
				
				document.getElementById('playlist').appendChild(main);
			}
			
		}
		
		getcurrent(){
			var postsref = firebase.database().ref('top2000/current');        
			postsref.on('value', (snapshot)=> {
				let track = snapshot.val();
				this.setcurrentactive(track.toLowerCase());								
			});
		}
		
		setcurrentactive(t){
			if(t.length==0){return}
			let tracksplit = t.split("-");
			if(current!=-1){
				current.setAttribute('current',"0");
			}
			//console.log(tracksplit);

			let detected = detectWithFuzzy(tracksplit[0].trim(),tracksplit[1].trim());
			console.log(detected);
			if(detected){
				current = document.getElementById("playlist").childNodes[1999-(detected.refIndex+this.endind)];
				current.setAttribute('current',"1");					
				this.index=1999-(detected.refIndex+this.endind);
			}
			else{
				document.getElementById('playlist').childNodes[this.index+1].setAttribute('current',"1");
				current = document.getElementById('playlist').childNodes[this.index+1];
				document.getElementById('playlist').childNodes[Math.max(0,this.index-5)].scrollIntoView();
				this.index+=1;
			}
			document.getElementById('playlist').childNodes[Math.max(0,this.index-3)].scrollIntoView();


			// let detected=false;
			// for(let i=this.endind;i<=this.startind;i++){
			// 	if(this.filterTrack(this.top2000[i].ARTIEST.toLowerCase())==this.filterTrack(tracksplit[0]) && this.filterTrack(this.top2000[i].TITEL.toLowerCase())==this.filterTrack(tracksplit[1])){
			// 		//console.log(document.getElementById('playlist').childNodes[2000-i-1].innerText);					
			// 		document.getElementById('playlist').childNodes[2000-i-1].setAttribute('current',"1");					
			// 		document.getElementById('playlist').childNodes[Math.max(0,2000-i-5)].scrollIntoView();
			// 		current = document.getElementById('playlist').childNodes[2000-i-1];
			// 		detected=true;
			// 		this.index=2000-i-1;
			// 		break;			
			// 	}
			// }
			// if(detected==false && this.playdate>new Date(2020,11,25)){
			// 	console.log("Undetected track moving to automatic next!");
			// 	document.getElementById('playlist').childNodes[this.index+1].setAttribute('current',"1");
			// 	current = document.getElementById('playlist').childNodes[this.index+1];
			// 	document.getElementById('playlist').childNodes[Math.max(0,this.index-5)].scrollIntoView();

			// 	this.index+=1;
			// }
		}
		
		 filterTrack(text){
			return text.replace(this.r,"");
		 }
}

let current = -1;	

function handleClick(e){
	var el = e.target.parentNode;
	
	let regexp3 = /\s/gm;
	let regexp4 = /[,'!@#$%^.*]/gm;
	
	let artist = el.getAttribute('artist').replace(regexp3,"-");
	let track = el.getAttribute('track').replace(regexp3,"-");
	
	artist = artist.replace(regexp4,"");
	track = track.replace(regexp4,"");		
	
	artist = artist.replace('&',"and");
	track = track.replace('&',"and");	
	
	url="https://genius.com/"+artist+"-"+track+"-lyrics";
	win = window.open(url, '_blank');				
}

function performFuzzySearch(list, pattern,keys){


	let options = {
	  // isCaseSensitive: false,
	  includeScore: true,
	  shouldSort: true,
	  // includeMatches: false,
	  // findAllMatches: false,
	  minMatchCharLength: 3,
	  //location: 0,
	  threshold: 0.6,
	  // distance: 100,
	  // useExtendedSearch: false,
	  // ignoreLocation: false,
	  // ignoreFieldNorm: false,
	  keys: keys
	};
	
	const fuse = new Fuse(list, options);
	
	return fuse.search(pattern);
	}
	
	Array.prototype.diff = function(arr2) {
		var ret = [];
		this.sort();
		arr2.sort();
		for(var i = 0; i < this.length; i += 1) {
			if(arr2.indexOf(this[i]) > -1){
				ret.push(this[i]);
			}
		}
		return ret;
	};

	
	function detectWithFuzzy(a,t=""){
		let query = `${a} ${t}`;
		let searchlist = Top2000.top2000.slice(Top2000.endind,Top2000.startind);
		if(t.length==0){
			query=a;
			searchlist = Top2000.top2000; 
		};
		let alist = performFuzzySearch(searchlist, query,["SONGARTIST"]);		
		
		if(alist.length>0){
			console.log(`Most Likely find for '${query}': '${alist[0].item.ARTIEST}-${alist[0].item.TITEL}'. Certainty: ${1/alist[0].score}`);
			return alist[0];
		}
		else{
			console.log(`No results for: '${query}'`);
			return false;
		}
		
	}
	
// Elements
document.getElementById('search-fab').addEventListener('click',displaySearchbar);
const searchFabIcon = document.getElementById('search-fab-icon')
const searchBar = document.getElementById("search-bar");

const searchBox = document.getElementById('search-box')
searchBox.addEventListener('input', searchAll)

function displaySearchbar() {
		if (searchBar.style.display === "block") {
			searchBar.style.display = "none";
			searchFabIcon.classList.add("fa-search")
			searchFabIcon.classList.remove("fa-times")
			searchBar.classList.remove("trans-in-el");
			console.log("none!")
		} else {
			searchBar.style.display = "block";
			searchFabIcon.classList.add("fa-times")
			searchFabIcon.classList.remove("fa-search")
			searchBar.classList.add("trans-in-el");
			searchBox.focus();
			console.log("block!")
		}
	}

	function searchAll(e){
		let searchValue = e.target.value;

		// if(searchValue.length==0){return}
		// if(current!=-1){
		// 	current.setAttribute('current',"0");
		// }
		let detectedInFind = detectWithFuzzy(searchValue);
		if(detectedInFind) {
			current = document.getElementById("playlist").childNodes[1999 - (detectedInFind.refIndex)];
			current.setAttribute('found', "1");
			Top2000.index = 1999 - (detectedInFind.refIndex);
			document.getElementById('playlist').childNodes[Math.max(0, Top2000.index - 1)].scrollIntoView();
		}
	}