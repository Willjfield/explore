///////////////////////COMPUTE PLANET POSITIONS//////////////////////////////

//1. Solar Ecliptic Coordinate System (SE)
//The SE is a heliocentric coordinate system with the Z-axis normal to and northward from the ecliptic plane. The X-axis extends toward the first point of Aries (Vernal Equinox, i.e. to the Sun from Earth in the first day of Spring). The Y-axis completes the right handed set. The Vernal Equinox direction changes slowly; commonly invoked equinox epochs are (1) B-1950, (2) Mean-of-(current) Date, and (3) J-2000. The ecliptic longitude SE_LONG increases from zero in the x-direction towards Y-direction; the latitude, SE_LAT increases to +90 deg towards north ecliptic pole and to -90 deg towards south pole.

// Functions for the planets from bkinsey808/simple_cal/astrotools/planets.js
// Copyright Ole Nielsen 2002-2004
// Please read copyright notice in astrotools2.html source
// Formulae and elements from Paul Schlyter's article "Computing planetary positions" available at
// http://hem.passagen.se/pausch/comp/ppcomp.html

var MERCURY = 0, VENUS = 1, EARTH = 2, MARS = 3, JUPITER = 4, SATURN = 5,
URANUS = 6, NEPTUNE = 7, SUN = 9, MOON = 10, COMET = 15, USER = 20;

// Planet diameters at 1 AU in arcsec (km for Moon)
var ndiam = [6.72, 16.68, 1, 9.36, 196.88, 165.46, 70.04, 67.0, 1, 1919.3, 716900000.0];

// The planet object

function planet(name,num,N,i,w,a,e,M,radius,oblique,dayLength,yearLength,color,rgbColor) {
	this.name=name;
	this.num=num;
	this.N=N; 	// longitude of ascending node
	this.i=i;		// inclination
	this.w=w;	// argument of perihelion
	this.a=a;	// semimajor axis
	this.e=e;		// eccentricity
	this.M=M;	// mean anomaly

	this.radius = radius;//km
	this.oblique = oblique;//degrees rotation is off center
	this.dayLength = dayLength;//length of day
	this.yearLength = yearLength;//length of 1 sidereal year in Earth days
	this.texColor = color;//hex color to approximate surface
	this.currentPlanetRotation = 0;
	this.rgbColor = rgbColor;
	/*
	this.webShader = webShader;
	*/
}

planet.prototype.rotationAt = function(jday){	
	// var _jday
	// typeof "jday" == undefined ? _jday = xpl.now : _jday=jday
	var currentPlanetRotation = ((jday)%(this.dayLength/23.9344))*2*Math.PI+0.04363323127;//+0.166667
	return currentPlanetRotation;
};
//http://nssdc.gsfc.nasa.gov/planetary/planetfact.html
xpl.sol = {
	radius: 696300,
	dayLength: 587.28,
	texColor:0xffff44,
	rgbColor:{r:255,g:255,b:68}
};

xpl.mercury = new planet("Mercury",0,
   new Array(48.3313, 3.24587E-5),
   new Array(7.0047, 5.00E-8),
   new Array(29.1241, 1.01444E-5),
   new Array(0.387098, 0),
   new Array(0.205635, 5.59E-10),
   new Array(168.6562, 4.0923344368),
   2439.5/2,
   0.01,
   4222.6,
   87.969,
   0xffffff,
   {r:255,g:255,b:255}
   );

xpl.venus = new planet("Venus",1,
   new Array(76.6799, 2.46590E-5),
   new Array(3.3946, 2.75E-8),
   new Array(54.8910, 1.38374E-5),
   new Array(0.723330, 0),
   new Array(0.006773, -1.302E-9),
   new Array(48.0052, 1.6021302244),
   12104/2,
   177.4,
   2802,
   224.701,
   0xff9933,
   {r:255,g:153,b:51}
   );

var eObl = xpl.curEarthOblique(xpl.now);

xpl.earth = new planet("Earth",2,
   new Array(0,0),
   new Array(0,0),
   new Array(282.9404,4.70935E-5),
   new Array(-1.0, 0.0),
   new Array(0.016709, - 1.151E-9),
   new Array(356.0470, 0.9856002585),
   12756/2,
   eObl,
   23.9344,
   365.256,
   0x00ff99,
   {r:0,g:255,b:153}
   );

xpl.mars = new planet("Mars",3,
   new Array(49.5574, 2.11081E-5),
   new Array(1.8497, -1.78E-8),
   new Array(286.5016, 2.92961E-5),
   new Array(1.523688, 0),
   new Array(0.093405, 2.516E-9),
   new Array(18.6021, 0.5240207766),
   6792/2,
   25.2,
   24.7,
   686.98,
   0xff0000,
   {r:255,g:0,b:0}
   );

xpl.jupiter = new planet("Jupiter",4,
   new Array(100.4542, 2.76854E-5),
   new Array(1.3030, -1.557E-7),
   new Array(273.8777, 1.64505E-5),
   new Array(5.20256, 0),
   new Array(0.048498, 4.469E-9),
   new Array(19.8950, 0.0830853001),
   142984/2,
   3.1,
   9.9,
   4332.589,
   0xff4d88,
   {r:255,g:77,b:136}
   );

xpl.saturn = new planet("Saturn",5,
	new Array(113.6634, 2.38980E-5),
	new Array(2.4886, -1.081E-7),
	new Array(339.3939, 2.97661E-5),
	new Array(9.55475, 0),
	new Array(0.055546, -9.499E-9),
	new Array(316.9670, 0.0334442282),
	120536/2,
	26.7,
	10.7,
	10759.22,
	0xa0ff00,
   	{r:160,g:255,b:0}
	);

xpl.uranus = new planet("Uranus",6,
	new Array(74.0005, 1.3978E-5),
	new Array(0.7733, 1.9E-8),
	new Array(96.6612, 3.0565E-5),
	new Array(19.18171, -1.55E-8),
	new Array(0.047318, 7.45E-9),
	new Array(142.5905, 0.011725806),
	51118/2,
	97.8,
	17.2,
	30685.4,
	0x0055ff,
   	{r:0,g:85,b:255}
	);

xpl.neptune = new planet("Neptune",7,
	new Array(131.7806, 3.0173E-5),
	new Array(1.7700, -2.55E-7),
	new Array(272.8461, -6.027E-6),
	new Array(30.05826, 3.313E-8),
	new Array(0.008606, 2.15E-9),
	new Array(260.2471, 0.005995147),
	49528/2,
	28.3,
	16.1,
	60189,
	0x730099,
   	{r:115,g:0,b:153}
	);

// elements from Paul Schlyter
var planets=[xpl.mercury,xpl.venus,xpl.earth,
				xpl.mars,xpl.jupiter,xpl.saturn,
				xpl.uranus,xpl.neptune];

xpl.planets = planets;

for(var p in planets){
		planets[p].rotationAt(xpl.now);
	}

// heliocentric xyz for planet p
// this is not from Meeus' book, but from Paul Schlyter http://hem.passagen.se/pausch/comp/ppcomp.html
// account for pertuberations of Jupiter, Saturn, Uranus (Uranus and Neptune mutual pertubs are included in elements)
// returns heliocentric x, y, z, distance, longitude and latitude of object

xpl.SolarSystem = function(p,jday){
    return planet_xyz(p,jday);
};

function planet_xyz(p,jday) {
    var d = jday-2451543.5;
	var w = p.w[0] + p.w[1]*d;		// argument of perihelion
	var e = p.e[0] + p.e[1]*d;
	var a = p.a[0] + p.a[1]*d;
	var i = p.i[0] + p.i[1]*d;
	var N = p.N[0] + p.N[1]*d;
	var M = rev( p.M[0] + p.M[1]*d ); 	// mean anomaly
	var E0 = M + RAD2DEG*e*sind(M) * ( 1.0+e*cosd(M) );
	var E1 = E0 - ( E0-RAD2DEG*e*sind(E0)-M ) / ( 1.0-e*cosd(E0) );
	while (Math.abs(E0-E1) > 0.0005) {
		E0 = E1;
		E1 = E0 - ( E0 - RAD2DEG*e*sind(E0)-M ) / ( 1.0-e*cosd(E0) );
	}
	var xv = a*(cosd(E1) - e);
	var yv = a*Math.sqrt(1.0 - e*e) * sind(E1);
	var v = rev(atan2d( yv, xv ));		// true anomaly
	var r = Math.sqrt( xv*xv + yv*yv );	// distance
	var xh = r * ( cosd(N)*cosd(v+w) - sind(N)*sind(v+w)*cosd(i) );
	var yh = r * ( sind(N)*cosd(v+w) + cosd(N)*sind(v+w)*cosd(i) );
	var zh = r * ( sind(v+w)*sind(i) );
	var lonecl = atan2d(yh, xh);
	var latecl = atan2d(zh, Math.sqrt(xh*xh + yh*yh + zh*zh));
	if (p.num==JUPITER) {		// Jupiter pertuberations by Saturn
		var Ms = rev(planets[SATURN].M[0] + planets[SATURN].M[1]*d);
		lonecl += (-0.332)*sind(2*M-5*Ms-67.6) - 0.056*sind(2*M-2*Ms+21) + 0.042*sind(3*M-5*Ms+21) -
				0.036*sind(M-2*Ms) + 0.022*cosd(M-Ms) + 0.023*sind(2*M-3*Ms+52) - 0.016*sind(M-5*Ms-69);
		xh=r*cosd(lonecl)*cosd(latecl);		// recalc xh, yh
		yh=r*sind(lonecl)*cosd(latecl);
	}
	if (p.num==SATURN) {		// Saturn pertuberations
		var Mj = rev(planets[JUPITER].M[0] + planets[JUPITER].M[1]*d);
		lonecl += 0.812*sind(2*Mj-5*M-67.6) - 0.229*cosd(2*Mj-4*M-2) + 0.119*sind(Mj-2*M-3) +
				0.046*sind(2*Mj-6*M-69) + 0.014*sind(Mj-3*M+32);
		latecl += -0.020*cosd(2*Mj-4*M-2) + 0.018*sind(2*Mj-6*M-49);
		xh = r*cosd(lonecl)*cosd(latecl);		// recalc xh, yh, zh
		yh = r*sind(lonecl)*cosd(latecl);
    	zh = r*sind(latecl);
	}
	if (p.num==URANUS) {		// Uranus pertuberations
		var Mj = rev(planets[JUPITER].M[0] + planets[JUPITER].M[1]*d);
		var Ms = rev(planets[SATURN].M[0] + planets[SATURN].M[1]*d);
		lonecl += 0.040*sind(Ms-2*M+6) + 0.035*sind(Ms-3*M+33) - 0.015*sind(Mj-M+20);
		xh=r*cosd(lonecl)*cosd(latecl);		// recalc xh, yh
		yh=r*sind(lonecl)*cosd(latecl);
	}
	return new Array(xh,yh,zh,r,lonecl,latecl);
}

xpl.radecr = function(obj,sun,jday,obs){
        return radecr(obj,sun,jday,obs);
    };

function radecr(obj,sun,jday,obs) {
// radecr returns ra, dec and earth distance
// obj and sun comprise Heliocentric Ecliptic Rectangular Coordinates
// (note Sun coords are really Earth heliocentric coordinates with reverse signs)
	// Equatorial geocentric co-ordinates
	var xg=obj[0]+sun[0];
	var yg=obj[1]+sun[1];
	var zg=obj[2];
	// Obliquity of Ecliptic (exponent corrected, was E-9!)
	var obl = 23.4393 - 3.563E-7 * (jday-2451543.5);
	// Convert to eq. co-ordinates
	var x1=xg;
	var y1=yg*cosd(obl) - zg*sind(obl);
	var z1=yg*sind(obl) + zg*cosd(obl);
	// RA and dec (33.2)
	var ra=rev(atan2d(y1, x1));
	var dec=atan2d(z1, Math.sqrt(x1*x1+y1*y1));
	var dist=Math.sqrt(x1*x1+y1*y1+z1*z1);
	return new Array(ra,dec,dist);
}

xpl.radec2aa = function(ra,dec,jday,obs){
	return radec2aa(ra,dec,jday,obs);
};

function radec2aa(ra,dec,jday,obs) {
	// Convert ra/dec to alt/az, also return hour angle, azimut = 0 when north
	// DOES NOT correct for parallax!
	// TH0=Greenwich sid. time (eq. 12.4), H=hour angle (chapter 13)
	// Changed from planets.js which was incorrect!
	var gmst = rev(280.46061837 + 360.98564736629*(jday-2451545.0));
    var LST = gmst+obs.longitude;
	var H = LST-ra;
	var alt = asind( sind(obs.latitude)*sind(dec) + cosd(obs.latitude)*cosd(dec)*cosd(H) );
	var az = atan2d( sind(H), (cosd(H)*sind(obs.latitude) - tand(dec)*cosd(obs.latitude)) );
	return new Array (alt, rev(az+180.0), H);
}


function separation(ra1, ra2, dec1, dec2) {
	// ra, dec may also be long, lat, but PA is relative to the chosen coordinate system
	var d = acosd(sind(dec1)*sind(dec2) + cosd(dec1)*cosd(dec2)*cosd(ra1-ra2));		// (Meeus 17.1)
	if (d < 0.1) d = Math.sqrt(sqr( rev2(ra1-ra2)*cosd((dec1+dec2)/2) ) + sqr(dec1-dec2));	// (17.2)
	var pa = atan2d(sind(ra1-ra2),cosd(dec2)*tand(dec1)-sind(dec2)*cosd(ra1-ra2));		// angle
	return new Array(d, rev(pa));
}	// end separation()


// SUN and MOON
// Alternative version of Sun position based on Schlyter's method

// Copyright Ole Nielsen 2002-2004
// Please read copyright notice in astrotools2.html source

// 'Meeus' means "Astronomical Algorithms", 2nd ed. by Jean Meeus

// ecliptic position of the Sun relative to Earth (basically simplified version of planetxyz calc)
function sunxyz(jday) {
	// return x,y,z ecliptic coordinates, distance, true longitude
	// days counted from 1999 Dec 31.0 UT
	var d=jday-2451543.5;
	var w = 282.9404 + 4.70935E-5 * d;		// argument of perihelion
	var e = 0.016709 - 1.151E-9 * d;
	var M = rev(356.0470 + 0.9856002585 * d); // mean anomaly
	var E = M + e*RAD2DEG * sind(M) * ( 1.0 + e * cosd(M) );
	var xv = cosd(E) - e;
	var yv = Math.sqrt(1.0 - e*e) * sind(E);
	var v = atan2d( yv, xv );		// true anomaly
	var r = Math.sqrt( xv*xv + yv*yv );	// distance
	var lonsun = rev(v + w);	// true longitude
	var xs = r * cosd(lonsun);		// rectangular coordinates, zs = 0 for sun
	var ys = r * sind(lonsun);
	return new Array(xs,ys,0,r,lonsun,0);
}

function SunAlt(jday, obs) {
	// return alt, az, time angle, ra, dec, ecl. long. and lat=0, illum=1, 0,
	// dist, brightness
	var sdat = sunxyz(jday);
	var ecl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
	var xe = sdat[0];
	var ye = sdat[1] * cosd(ecl);
	var ze = sdat[1] * sind(ecl);
	var ra = rev(atan2d(ye, xe));
	var dec = atan2d(ze, Math.sqrt(xe * xe + ye * ye));
	var topo = radec2aa(ra, dec, jday, obs);
	return new Array(topo[0], topo[1], topo[2], ra, dec, sdat[4], 0, 1, 0,
			sdat[3], -26.74);
	}

xpl.MoonPos = function(jday,obs){
	return MoonPos(jday,obs);
};

function MoonPos(jday, obs) {
	// MoonPos calculates the Moon position and distance, based on Meeus chapter
	// 47
	// and the illuminated percentage from Meeus equations 48.4 and 48.1
	// OPN: This version of MoonPos calculates the position to a precision of
	// about 2' or so
	// All T^2, T^3 and T^4 terms skipped. NB: Time is not taken from obs but
	// from jday (julian day)
	// Returns alt, az, hour angle, ra, dec (geocentr!), eclip. long and lat
	// (geocentr!),
	// illumination, distance, brightness and phase angle
	var T = (jday - 2451545.0) / 36525;
	// Moons mean longitude L'
	var LP = rev(218.3164477 + 481267.88123421 * T);
	// Moons mean elongation
	var D = rev(297.8501921 + 445267.1114034 * T);
	// Suns mean anomaly
	var M = rev(357.5291092 + 35999.0502909 * T);
	// Moons mean anomaly M'
	var MP = rev(134.9633964 + 477198.8675055 * T);
	// Moons argument of latitude
	var F = rev(93.2720950 + 483202.0175233 * T);
	// The "further arguments" A1, A2 and A3 and the term E have been ignored
	// Sum of most significant terms from table 45.A and 45.B (terms less than
	// 0.004 deg / 40 km dropped)
	var Sl = 6288774 * sind(MP) + 1274027 * sind(2 * D - MP) + 658314 *
			sind(2 * D) + 213618 * sind(2 * MP) - 185116 * sind(M) - 114332 *
			sind(2 * F) + 58793 * sind(2 * D - 2 * MP) + 57066 *
			sind(2 * D - M - MP) + 53322 * sind(2 * D + MP) + 45758 *
			sind(2 * D - M) - 40923 * sind(M - MP) - 34720 * sind(D) - 30383 *
			sind(M + MP) + 15327 * sind(2 * D - 2 * F) - 12528 *
			sind(MP + 2 * F) + 10980 * sind(MP - 2 * F) + 10675 *
			sind(4 * D - MP) + 10034 * sind(3 * MP) + 8548 *
			sind(4 * D - 2 * MP) - 7888 * sind(2 * D + M - MP) - 6766 *
			sind(2 * D + M) - 5163 * sind(D - MP) + 4987 * sind(D + M) + 4036 *
			sind(2 * D - M + MP);
	var Sb = 5128122 * sind(F) + 280602 * sind(MP + F) + 277602 * sind(MP - F) +
			173237 * sind(2 * D - F) + 55413 * sind(2 * D - MP + F) + 46271 *
			sind(2 * D - MP - F) + 32573 * sind(2 * D + F) + 17198 *
			sind(2 * MP + F) + 9266 * sind(2 * D + MP - F) + 8822 *
			sind(2 * MP - F) + 8216 * sind(2 * D - M - F) + 4324 *
			sind(2 * D - 2 * MP - F) + 4200 * sind(2 * D + MP + F);
	var Sr = (-20905355) * cosd(MP) - 3699111 * cosd(2 * D - MP) - 2955968 *
			cosd(2 * D) - 569925 * cosd(2 * MP) + 246158 *
			cosd(2 * D - 2 * MP) - 152138 * cosd(2 * D - M - MP) - 170733 *
			cosd(2 * D + MP) - 204586 * cosd(2 * D - M) - 129620 *
			cosd(M - MP) + 108743 * cosd(D) + 104755 * cosd(M + MP) + 79661 *
			cosd(MP - 2 * F) + 48888 * cosd(M);
	// geocentric longitude, latitude
	var mglong = rev(LP + Sl / 1000000.0);
	var mglat = Sb / 1000000.0;
	// Obliquity of Ecliptic
	var obl = 23.4393 - 3.563E-7 * (jday - 2451543.5);
	var ra = rev(atan2d(sind(mglong) * cosd(obl) - tand(mglat) * sind(obl),
			cosd(mglong)));
	var dec = asind(sind(mglat) * cosd(obl) + cosd(mglat) * sind(obl) *
			sind(mglong));
	var moondat = radec2aa(ra, dec, jday, obs);
	// phase angle (48.4)
	var pa = Math.abs(180.0 - D - 6.289 * sind(MP) + 2.100 * sind(M) - 1.274 *
			sind(2 * D - MP) - 0.658 * sind(2 * D) - 0.214 * sind(2 * MP) -
			0.11 * sind(D));
	var k = (1 + cosd(pa)) / 2;
	var mr = Math.round(385000.56 + Sr / 1000.0);
	var h = moondat[0];
	// correct for parallax, equatorial horizontal parallax, see Meeus p. 337
	h -= asind(6378.14 / mr) * cosd(h);
	// brightness, use Paul Schlyter's formula (based on common phase law for
	// Moon)
	var sdat = sunxyz(jday);
	var r = sdat[3];
	// Earth (= Moon) distance to Sun in AU
	var R = mr / 149598000;
	// Moon distance to Earth in AU
	var mag = 0.23 + 5 * log10(r * R) + 0.026 * pa + 4.0E-9 * pa * pa * pa * pa;



	var j;
	var ip, ag;
	ip = (jday + 4.867) / 29.53059;
	ip = ip - Math.floor(ip);
	if(ip < 0.5)
	{
	    ag = ip * 29.53059 + 29.53059 / 2;
	}
	else
	{
	    ag = ip * 29.53059 - 29.53059 / 2;
	}
	ag = Math.floor(ag) + 1;


	return new Array(h, moondat[1], moondat[2], ra, dec, mglong, mglat, k, r,
			mr, mag, ag);
}

xpl.PlanetAlt = function(p,jday,obs) {
	return PlanetAlt(p,jday, obs);
};

function PlanetAlt(p,jday,obs) {
// Alt/Az, hour angle, ra/dec, ecliptic long. and lat, illuminated fraction, dist(Sun), dist(Earth), brightness of planet p
	//(typeof epoch == undefined) ? epoch = 2000 : newEpoch = epoch
	if (p==2) return SunAlt(jday,obs);
	if (p==MOON) return MoonPos(jday,obs);
	if (p==COMET) return CometAlt(jday,obs);
	var sun_xyz = sunxyz(jday);
    //console.log(sun_xyz)
	var planet_xyz = xpl.SolarSystem(xpl.planets[p],jday);

	var dx = planet_xyz[0]+sun_xyz[0];
	var dy = planet_xyz[1]+sun_xyz[1];
	var dz = planet_xyz[2]+sun_xyz[2];
	var lon = rev( atan2d(dy, dx) );
	lon+= 3.82394E-5 * (jday-2451545.0);

	var lat = atan2d(dz, Math.sqrt(dx*dx+dy*dy));

	var radec = radecr(planet_xyz, sun_xyz, jday, obs);
	var ra = radec[0];
	var dec = radec[1];
	var altaz = radec2aa(ra, dec, jday, obs);

	var dist = radec[2];
	var R = sun_xyz[3];	// Sun-Earth distance
	var r = planet_xyz[3];	// heliocentric distance
	var k = ((r+dist)*(r+dist)-R*R) / (4*r*dist);		// illuminated fraction (41.2)
	// brightness calc according to Meeus p. 285-86 using Astronomical Almanac expressions
	var absbr = new Array(-0.42, -4.40, 0, -1.52, -9.40, -8.88, -7.19, -6.87);
	var i = acosd( (r*r+dist*dist-R*R) / (2*r*dist) );	// phase angle
	var mag = absbr[p] + 5 * log10(r*dist);	// common for all planets
	switch(p) {
	case MERCURY:
		mag += i*(0.0380 + i*(-0.000273 + i*0.000002)); break;
	case VENUS:
		mag += i*(0.0009 + i*(0.000239 - i*0.00000065)); break;
	case MARS:
		mag += i*0.016; break;
	case JUPITER:
		mag += i*0.005; break;
	case SATURN:	// (Ring system needs special treatment, see Meeus Ch. 45)
		var T = (jday-2451545.0)/36525;		// (22.1)
		var incl = 28.075216 - 0.012998*T + 0.000004*T*T;	// (45.1)
		var omega = 169.508470 + 1.394681*T + 0.000412*T*T;	// (45.1)
		var B = asind(sind(incl)*cosd(lat)*sind(lon-omega) - cosd(incl)*sind(lat));
		var l = planet_xyz[4];	// heliocentric longitude of Saturn
		var b = planet_xyz[5];	// heliocentric latitude (do not confuse with 'b' in step 6, page 319)
		// correction for Sun's aberration skipped
		var U1 = atan2d(sind(incl)*sind(b)+cosd(incl)*cosd(b)*sind(l-omega), cosd(b)*cosd(l-omega));
		var U2 = atan2d(sind(incl)*sind(lat)+cosd(incl)*cosd(lat)*sind(lon-omega), cosd(lat)*cosd(lon-omega));
		var dU = Math.abs(U1 - U2);
		mag += 0.044*dU - 2.60*sind(Math.abs(B)) + 1.25*sind(B)*sind(B);
		break;
	}
	return new Array (altaz[0], altaz[1], altaz[2], ra, dec, lon, lat, k, r, dist, mag);
}

xpl.curEarthOblique = function(jday){
        var _jd;
        typeof jday == undefined ? _jd = xpl.now : _jd = jday
        var t = ((_jd-2451545)/365.25/10000)
        var obl = 23.43929-
        (1.300258*t)-
        (0.0004305556*Math.pow(t,2))+
        (0.5553472*Math.pow(t,3))- 
        (0.01427222*Math.pow(t,4))-
        (0.06935278*Math.pow(t,5))-
        (0.01084722*Math.pow(t,6))+
        (0.001977778*Math.pow(t,7))+
        (0.007741667*Math.pow(t,8))+
        (0.001608333*Math.pow(t,9))+
        (0.0006805556*Math.pow(t,10))

        return obl
    }
