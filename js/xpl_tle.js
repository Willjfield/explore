xpl.tle = function(line1, line2, name) {
	if(typeof name == 'undefined'){this.name='';}else{this.name=name;}
    this.line1 = line1;
    this.line2 = line2;

    // this.latlongalt;
    // this.position_eci;
    // this.velocity_eci;
    // this.position_ecf;
    // this.position_helio;
    this.deltaSeconds = 0;

    this.update = function(t) {
    	if(typeof t === "undefined"){t = 0;}
        // Initialize a satellite record
        var satrec = xpl.satellite.twoline2satrec (this.line1, this.line2);
        
		var curgstime = xpl.satellite.gstime_from_jday(xpl.now+t);
        //MAKE DELTA DAYS ACCESSIBLE OUTSIDE THIS FUNCTION, RIGHT NOW, UPDATE ONLY UPDATES IN REAL TIME B/C now = new DATE
        //NEED TO MAKE NEW DATE() at CONSTRUCTION AND ADD T IN THIS FUNCTION
        //PROPAGATE NEEDS TO USE JDAY NOT CAL DATE

        // Propagate satellite using current time
        var now = new Date();
        now.setSeconds(now.getSeconds()+(t*86400));
        //console.log(now)
        //console.log(t)
        // NOTE: while Javascript Date returns months in range 0-11, all satellite.js methods require months in range 1-12.
        var position_and_velocity = xpl.satellite.propagate (satrec,
                                                        now.getUTCFullYear(),
                                                        now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
                                                        now.getUTCDate(),
                                                        now.getUTCHours(),
                                                        now.getUTCMinutes(),
                                                        now.getUTCSeconds());
        // The position_velocity result is a key-value pair of ECI coordinates.
        // These are the base results from which all other coordinates are derived.
        var _position_eci = position_and_velocity.position;
        var _velocity_eci = position_and_velocity.velocity;
        // The coordinates are all stored in key-value pairs.
        // ECI and ECF are accessed by "x", "y", "z".
		//convert current satellite eci to lat/long in degrees and radians 
        var _latlongalt = xpl.satellite.eci_to_geodetic(_position_eci, curgstime);

        
        _latlongalt.longitude = _latlongalt.longitude;
        _latlongalt.latitude = _latlongalt.latitude;
        _latlongalt.height = _latlongalt.height;
        _latlongalt.longitudeDeg = _latlongalt.longitude*RAD2DEG;
        _latlongalt.latitudeDeg = _latlongalt.latitude*RAD2DEG;

        //make position velocity and lat/long available to the outside
        this.latlongalt = _latlongalt;
        this.position_ecf = xpl.satellite.geodetic_to_ecf(this.latlongalt);
    	this.position_eci = _position_eci;
    	this.velocity_eci = _velocity_eci;
    };

    this.getLookAnglesFrom = function(_longitude,_latitude, elevation){
    	var my_geodetic = new xpl.createGeodetic(_longitude,_latitude, elevation);
    	var my_ecf = xpl.satellite.geodetic_to_ecf(my_geodetic);
    	//FIRST ARGUMENT TO xpl.satellite.ecf_to_look_angles IS GEODETIC, NOT ECF COORDS
    	//RETURNS RADIANS
    	var lookAngles = xpl.satellite.ecf_to_look_angles(my_geodetic,this.position_ecf);
    	lookAngles.azimuth*=RAD2DEG;
    	lookAngles.elevation*=RAD2DEG;
    	return lookAngles;
    };
};