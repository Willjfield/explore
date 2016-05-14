/*
 * satellite-js v1.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

function eci_to_geodetic (eci_coords, gmst) {
    // http://www.celestrak.com/columns/v02n03/
    var a   = 6378.137;
    var b   = 6356.7523142;
    var R   = Math.sqrt( (eci_coords.x*eci_coords.x) + (eci_coords.y*eci_coords.y) );
    var f   = (a - b)/a;
    var e2  = ((2*f) - (f*f));
    var longitude = Math.atan2(eci_coords.y, eci_coords.x) - gmst;
    var kmax = 20;
    var k = 0;
    var latitude = Math.atan2(eci_coords.z,
                   Math.sqrt(eci_coords.x*eci_coords.x +
                                eci_coords.y*eci_coords.y));
    var C;
    while (k < kmax){
        C = 1 / Math.sqrt( 1 - e2*(Math.sin(latitude)*Math.sin(latitude)) );
        latitude = Math.atan2 (eci_coords.z + (a*C*e2*Math.sin(latitude)), R);
        k += 1;
    }
    var height = (R/Math.cos(latitude)) - (a*C);
    return { longitude : longitude, latitude : latitude, height : height };
}

xpl.eci_to_ecf = function(eci_coords, gmst){
	return eci_to_ecf (eci_coords, gmst);
};

function eci_to_ecf (eci_coords, gmst){
    // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
    //
    // [X]     [C -S  0][X]
    // [Y]  =  [S  C  0][Y]
    // [Z]eci  [0  0  1][Z]ecf
    //
    //
    // Inverse:
    // [X]     [C  S  0][X]
    // [Y]  =  [-S C  0][Y]
    // [Z]ecf  [0  0  1][Z]eci

    var X = (eci_coords.x * Math.cos(gmst))    + (eci_coords.y * Math.sin(gmst));
    var Y = (eci_coords.x * (-Math.sin(gmst))) + (eci_coords.y * Math.cos(gmst));
    var Z =  eci_coords.z;
    return { x : X, y : Y, z : Z };
}
xpl.ecf_to_eci = function(ecf_coords, gmst){
	return ecf_to_eci(ecf_coords, gmst);
};

function ecf_to_eci (ecf_coords, gmst){
    // ccar.colorado.edu/ASEN5070/handouts/coordsys.doc
    //
    // [X]     [C -S  0][X]
    // [Y]  =  [S  C  0][Y]
    // [Z]eci  [0  0  1][Z]ecf
    //
    var X = (ecf_coords.x * Math.cos(gmst))    - (ecf_coords.y * Math.sin(gmst));
    var Y = (ecf_coords.x * (Math.sin(gmst)))  + (ecf_coords.y * Math.cos(gmst));
    var Z =  ecf_coords.z;
    return { x : X, y : Y, z : Z };
}
// xpl.geodetic_to_ecf = function(geodetic_coords){}
function geodetic_to_ecf (geodetic_coords){
    var longitude   = geodetic_coords.longitude;
    var latitude    = geodetic_coords.latitude;
    var height      = geodetic_coords.height;

    var a           = 6378.137;
    var b           = 6356.7523142;
    var f           = (a - b)/a;
    var e2          = ((2*f) - (f*f));
    var normal      = a / Math.sqrt( 1 - (e2*(Math.sin(latitude)*Math.sin(latitude))));


    var X           = (normal + height) * Math.cos (latitude) * Math.cos (longitude);
    var Y           = (normal + height) * Math.cos (latitude) * Math.sin (longitude);
    var Z           = ((normal*(1-e2)) + height) * Math.sin (latitude);


    return { x : X, y : Y, z : Z };
}

function topocentric (observer_coords, satellite_coords){
    // http://www.celestrak.com/columns/v02n02/
    // TS Kelso's method, except I'm using ECF frame
    // and he uses ECI.
    //
    //console.log(observer_coords)
    var longitude   = observer_coords.longitude;
    var latitude    = observer_coords.latitude;
    var height      = observer_coords.height;

    var observer_ecf = geodetic_to_ecf (observer_coords);

    var rx      = satellite_coords.x - observer_ecf.x;
    var ry      = satellite_coords.y - observer_ecf.y;
    var rz      = satellite_coords.z - observer_ecf.z;

    var top_s   = ( (Math.sin(latitude) * Math.cos(longitude) * rx) +
                  (Math.sin(latitude) * Math.sin(longitude) * ry) -
                  (Math.cos(latitude) * rz));
    var top_e   = ( -Math.sin(longitude) * rx) + (Math.cos(longitude) * ry);
    var top_z   = ( (Math.cos(latitude)*Math.cos(longitude)*rx) +
                  (Math.cos(latitude)*Math.sin(longitude)*ry) +
                  (Math.sin(latitude)*rz));
    return { top_s : top_s, top_e : top_e, top_z : top_z };
}

function topocentric_to_look_angles (topocentric){
    var top_s = topocentric.top_s;
    var top_e = topocentric.top_e;
    var top_z = topocentric.top_z;
    var range_sat    = Math.sqrt((top_s*top_s) + (top_e*top_e) + (top_z*top_z));
    var El      = Math.asin (top_z/range_sat);
    var Az      = Math.atan2 (-top_e, top_s) + pi;
    return { azimuth : Az, elevation : El, range_sat : range_sat };
}

function degrees_long (radians){
    var degrees = (radians/pi*180) % (360);
    if (degrees > 180){
        degrees = 360 - degrees;
    }
    else if (degrees < -180){
        degrees = 360 + degrees;
    }
    return degrees;
}

function degrees_lat (radians){
    if (radians > pi/2 || radians < (-pi/2)){
        return "Err";
    }
    var degrees = (radians/pi*180);
    if (degrees < 0){
        degrees = degrees;
    }
    else{
        degrees = degrees;
    }
    return degrees;
}

function ecf_to_look_angles(observer_coords_ecf, satellite_coords_ecf) {
    var topocentric_coords = topocentric (observer_coords_ecf, satellite_coords_ecf);
    return topocentric_to_look_angles (topocentric_coords);
}

satellite.topocentric_to_look_angles = function (topocentric){
	return topocentric_to_look_angles(topocentric);
};

satellite.eci_to_geodetic = function (eci_coords, gmst) {
    return eci_to_geodetic (eci_coords, gmst);
};

satellite.ecf_to_look_angles = function (observer_coords_ecf, satellite_coords_ecf) {
	return ecf_to_look_angles(observer_coords_ecf, satellite_coords_ecf);
};

satellite.geodetic_to_ecf = function (geodetic_coords) {
    return geodetic_to_ecf (geodetic_coords);
};
satellite.ecf_to_eci = function (ecf_coords, gmst) {
    return ecf_to_eci (ecf_coords, gmst);
};
satellite.eci_to_ecf = function (eci_coords, gmst) {
    return eci_to_ecf (eci_coords, gmst);
};

satellite.degrees_lat = function (radians) {
    return degrees_lat (radians);
};
satellite.degrees_long = function (radians) {
    return degrees_long (radians);
};
/*
 * satellite-js v1.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

function doppler_factor (my_location, position, velocity) {
    var current_range = Math.sqrt(
                        Math.pow(position.x - my_location.x, 2) +
                        Math.pow(position.y - my_location.y, 2) +
                        Math.pow(position.z - my_location.z, 2));
    var next_pos   = {
                        x : position.x + velocity.x,
                        y : position.y + velocity.y,
                        z : position.z + velocity.z
                    };
    var next_range =  Math.sqrt(
                      Math.pow(next_pos.x - my_location.x, 2) +
                      Math.pow(next_pos.y - my_location.y, 2) +
                      Math.pow(next_pos.z - my_location.z, 2));
    var range_rate =  next_range - current_range;

    function sign (value) {if (value >= 0) {return 1;} else {return -1;}}
    range_rate *= sign(range_rate);
    var c = 299792.458; // Speed of light in km/s
    var factor = (1 + range_rate/c);
    return factor;
}

satellite.doppler_factor = doppler_factor;
/*
 * satellite-js v1.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */

/*
var satellite = (function () {

    satellite-head.js and satellite-tail.js sandwich the remaining
    functions and code in the library headers.

    This is to separate the satellite.js namespace from the rest of
    the javascript environment.

    Consult the Makefile to see which files are going to be sandwiched. */

// This is the actual footer to the entire satellite.js library definition.

//     return satellite;

// })();

xpl.createGeodetic = function(_longitude,_latitude,_height){
	this.longitude = _longitude*DEG2RAD;
	this.latitude = _latitude*DEG2RAD;
	this.height = _height;
};