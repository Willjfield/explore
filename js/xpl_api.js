var categories = {
		 newTLE : "tle-new.txt",
		 stations : "stations.txt",
		 visible : "visual.txt",
		 FENGYUNDebris : "1999-025.txt",
		 iridiumDebris : "iridium-33-debris.txt",
		 cosmos2251Debris : "cosmos-2251-debris.txt",
		 BREEZEMDebris : "2012-044.txt",
		 weather : "weather.txt",
		 noaa : "noaa.txt",
		 goes : "goes.txt",
		 earthResources : "resource.txt",
		 searchRescue : "sarsat.txt",
		 disasterMonitor : "dmc.txt",
		 TDRSS : "tdrss.txt",
		 ARGOS : "argos.txt",
		 geostationary : "geo.txt",
		 intelsat : "intelsat.txt",
		 gorizont : "gorizont.txt",
		 raduga : "raduga.txt",
		 molniya : "molniya.txt",
		 iridium : "iridium.txt",
		 orbcomm : "orbcomm.txt",
		 globalstar : "globalstar.txt",
		 amateur : "amateur.txt",
		 experimental : "x-comm.txt",
		 otherComm : "other-comm.txt",
		 GPSOps : "gps-ops.txt",
		 glonassOps : "glo-ops.txt",
		 galileo : "galileo.txt",
		 beidou : "beidou.txt",
		 sbas : "sbas.txt",
		 nnss : "nnss.txt",
		 RussianLEONav : "musson.txt",
		 science : "science.txt",
		 geodetic : "geodetic.txt",
		 engineering : "engineering.txt",
		 education : "education.txt",
		 military : "military.txt",
		 radar : "radar.txt",
		 cubesats : "cubesat.txt",
		 other : "other.txt",
		 classified:"inttles.txt"
	};
	//classified:
	//var classified = "https://www.prismnet.com/~mmccants/tles/classfd.zip"

	//classified categories:
	var nro = ['Rhyolite','Vortex','Magnum','Mercury','Mentor','GeoLITE'];
	
	var airforce = ['Canyon','DSP','Milstar','SBIRS','GSSAP'];
	var navy=['FleetSatCom'];
	var jointusmilitary=['DSCS','SDS','Trumpet','USA','Delta4Demo','Mitex','WGS','MUOS','CLIO','ISON'];
	var soviet=['Ekran'];
	var jointothermilitaries=['Sicral','AEHF'];

	var unknown=['UFO','Unknown','UI168','Unknwn'];
	

	var classifiedCategories = [airforce,nro,navy,jointusmilitary,soviet,unknown,jointothermilitaries];
	xpl.classifiedMissions = ['Rhyolite','Vortex','Magnum','Mercury','Mentor','GeoLITE',
							'Canyon','DSP','Milstar','SBIRS','GSSAP',
							'FleetSatCom',
							'DSCS','SDS','Trumpet','USA','Delta4Demo','Mitex','WGS','MUOS','CLIO','ISON',
							'Ekran',
							'Sicral','AEHF',
							'UFO','Unknown','UI168','Unknwn','96044','UI168'];
	xpl.classifiedCategories = classifiedCategories;

	var xmlhttp = new XMLHttpRequest();

	xpl.getTLE = function(query, satellites, callback, pathToData){
		var path = '';
		var corsURL = "http://cors.io/?u=";
		var celestrakTypeURL = "http://www.celestrak.com/NORAD/elements/";
		var celestrakNORAD = "http://celestrak.com/cgi-bin/TLE.pl?CATNR=";
		var url;
		
		if(query == 'classified') {
			celestrakTypeURL='';
			corsURL="";
			if(typeof pathToData == 'undefined'){path='../../lib/data/';}
		}

		if(query in categories){
			url = path+corsURL + celestrakTypeURL + categories[query];
		}else{
			console.log("not a valid query");
			return 0;
		}

		xmlhttp.open("GET", url, true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			    var tleresponse = xmlhttp.responseText;
			    tleresponse = tleresponse.split('\n');
			    tleresponse.splice(tleresponse.length-1);
			    for(var s = 0; s<tleresponse.length;s+=3){
			    		satellites.push({
			    			id: tleresponse[s].replace(/\s/g, ''),
			    			line1 : tleresponse[s+1],
			    			line2 : tleresponse[s+2]
			    		});
			        }
			        callback();
		    }
		    
		};
		xmlhttp.send(null);
	};
	/* EXAMPLE:
	var stations = []
	getTLE("stations", stations, function(){
	console.log(stations)
	})*/

	xpl.batchTLEUpdate = function (tle_data, t) {
		if(typeof t == "undefined"){t = 0;}
	    for (var key in tle_data) {
	        if (tle_data.hasOwnProperty(key)) {
	            var obj = tle_data[key];
	            obj.update(t);
	        }
	    }
	};

	//TEXTURES
	//http://www.solarsystemscope.com/nexus/
	//http://www.celestiamotherlode.net/
	//http://visibleearth.nasa.gov/

	xpl.planetTex = ["mercury","venus","earth_day","mars","jupiter","saturn","uranus","neptune"];

	///WHAT IF I APPEND THE PLANET OBJECT WITH THESE TEXTURES??
	// function loadPlanetImage(planet,type,callback,pathToData){
	// 	var name = planet.name
	// 	var baseUrl = pathToData || "data/probes/"
	// 	var _type = "_"+type

	// 	var url = corsURL+baseUrl+name+_type+".jpg"

	// 	var xhr = new XMLHttpRequest();
	// 	xhr.open('GET', url , true);
	// 	xhr.responseType = 'blob';

	// 	xhr.onload = function(e) {
	// 	  if (this.status == 200) {
	// 	    var blob = new Blob([this.response], {type: 'image/jpg'});
	// 	    callback()
	// 	  }
	// 	};
	// 	xhr.send();
	// }

	// function loadPlanetTextures(planet,callback,pathToData){
	// 	loadPlanetImage(planet,day,function(){
	// 		loadPlanetImage(planet,normal,function(){
	// 			loadPlanetImage(planet,specular,function(){
	// 					callback()
	// 			},pathToData)
	// 		},pathToData)
	// 	},pathToData)
	// }

	///PROBES///
	//http://omniweb.gsfc.nasa.gov/coho/helios/heli.html
	function probePositions(probeName,array,callback,pathToData){
		var baseUrl = pathToData || "data/probes/";
		var xmlhttp = new XMLHttpRequest();
		var probePositions = [];
		var endUrl = "_solarEcliptic.txt";
		var url = baseUrl+probeName+endUrl;

		xmlhttp.open("GET", url, true);
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				    var data = xmlhttp.responseText;
				    data = data.split('\n');
				    for(var d in data){
				    	probePositions.push(data[d].split(/[ ]+/));
				    }
				    for(var p = 1; p<probePositions.length-1;p++){
				    	array.push({
				    		x:parseFloat(probePositions[p][2]),
				    		y:parseFloat(probePositions[p][4]),
				    		z:parseFloat(probePositions[p][3]),
				    		year:parseFloat(probePositions[p][0]),
				    		day:parseFloat(probePositions[p][1]),
				    		jday: jday(parseFloat(probePositions[p][0]), 1, 1, 0, 0, 0)+parseFloat(probePositions[p][1])
				    	});
				    }	
				   callback();			
			    }
			};
		xmlhttp.send(null);
	}

	xpl.probePositions = function(probeName,array,callback,pathToData){
		return probePositions(probeName,array,callback,pathToData);
	};