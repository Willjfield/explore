/*jslint node: true */
/*jslint expr: false */

//curEarthOblique NOT INCLUDED IN GULP YET!

"use strict";
var xpl = {};
//////////DEGREES/RADIANS CONVERSION///////////
var DEG2RAD = Math.PI/180.0;
var RAD2DEG = 180.0/Math.PI;

xpl.DEG2RAD = DEG2RAD;
xpl.RAD2DEG = RAD2DEG;

//////////DEFINITION OF MATH FUNCTIONS/////////
function rev(angle) 	{return angle-Math.floor(angle/360.0)*360.0;}		// 0<=a<360
function rev2(angle)	{var a = rev(angle); return (a>=180 ? a-360.0 : a);}	// -180<=a<180
function sind(angle) 	{return Math.sin(angle*DEG2RAD);}
function cosd(angle) 	{return Math.cos(angle*DEG2RAD);}
function tand(angle) 	{return Math.tan(angle*DEG2RAD);}
function asind(c) 		{return RAD2DEG*Math.asin(c);}
function acosd(c) 		{return RAD2DEG*Math.acos(c);}
function atand(c) 		{return RAD2DEG*Math.atan(c);}
function atan2d(y,x) 	{return RAD2DEG*Math.atan2(y,x);}

function log10(x) 		{return Math.LOG10E*Math.log(x);}

function sqr(x)			{return x*x;}
function cbrt(x)		{return Math.pow(x,1/3.0);}

function SGN(x) 		{ return (x<0)?-1:+1; }

// SUM ARRAYS ///
xpl.translatePositions = function (arr1, arr2) {
    var sum = [];
    if (arr1 !== null && arr2.length == arr1.length) {
        for (var i = 0; i < arr1.length; i++) {
            sum.push(arr2[i] + arr1[i]);
        }
    }
    return sum;
};
var scl = 1;
    
xpl.setScale = function(s){
    scl = s;
};

xpl.getScale = function(){
    return scl;
};

xpl.scaleVec3 = function(vector){
    var _x = vector.x*scl;
    var _y = vector.y*scl;
    var _z = vector.z*scl;

    return{x:_x,y:_y,z:_z};
};

xpl.scaleArray = function(array){
    var newArray = [];
    for(var p in array){
        newArray.push(array[p]*scl);
    }
    return newArray;
};

xpl.scalef = function(f){
    return f*scl;
};

xpl.kmtoau = function(km){
	return km*6.6846E-9;
};
/////////TIME TOOLS////////////

xpl.daysToSeconds = function (days){
	return days/0.00001157407;
};

xpl.hoursToSeconds = function (hours){
	return hours*3600;
};

xpl.minutesToSeconds = function (minutes){
	return minutes*60;
};

xpl.secondsToDays = function (seconds){
	return seconds*0.00001157407;
};

xpl.secondsToHours = function (seconds){
	return seconds/3600;
};

xpl.secondsToMinutes = function (seconds){
	return seconds/60;
};

xpl.jday = function (year, mon, day, hr, minute, sec){
	return jday(year, mon, day, hr, minute, sec);
};

function jday(year, mon, day, hr, minute, sec){
	typeof year == 'undefined' ? year = 0 : {};
	typeof mon == 'undefined' ? mon = 0 : {};
	typeof day == 'undefined' ? day = 0 : {};
	typeof hr == 'undefined' ? hr = 0 : {};
	typeof minute == 'undefined' ? minute = 0 : {};
	typeof sec == 'undefined' ? sec = 0 : {};

	return computeTheForm(year, mon, day, hr, minute, sec);
}
//Julian Date to Calendar Date conversion from
//http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
function computeTheForm(year, mon, day, hr, minute, sec)
{
	var leap = (
		(year%4 === 0)? 1:
		(year%4 !== 0? 0: 
		(year%400 === 0? 1:
		(year%100 === 0? 0:
		1))));
	var D = day;
	var M = mon;
	var Y = year;
	if(M<3)	{
		Y--;
		M += 12;
	}

		var A = Math.floor(Y/100);
		var B = Math.floor(A/4);
		var C = 2 - A + B;
	var E = Math.floor(365.25*(Y + 4716));
	var F = Math.floor(30.6001*(M + 1));
	var julianday = C + D + E + F - 1524.5;
 	var NewJD = julianday+((sec / 60.0 + minute) / 60.0 + hr) / 24.0;
	return NewJD;
}

xpl.dateFromJday = function(jday){
	return dateFromJday(jday);
};

//From http://www.onlineconversion.com/julian_date.htm
function dateFromJday(jd){
		var	j1, j2, j3, j4, j5;			//scratch
		//
		// get the date from the Julian day number
		//
	    var intgr   = Math.floor(jd);
	    var frac    = jd - intgr;
	    var gregjd  = 2299161;
		if( intgr >= gregjd ) {				//Gregorian calendar correction
			var tmp = Math.floor( ( (intgr - 1867216) - 0.25 ) / 36524.25 );
			j1 = intgr + 1 + tmp - Math.floor(0.25*tmp);
		} else
			j1 = intgr;

		//correction for half day offset
		var dayfrac = frac + 0.5;
		if( dayfrac >= 1.0 ) {
			dayfrac -= 1.0;
			++j1;
		}

		j2 = j1 + 1524;
		j3 = Math.floor( 6680.0 + ( (j2 - 2439870) - 122.1 )/365.25 );
		j4 = Math.floor(j3*365.25);
		j5 = Math.floor( (j2 - j4)/30.6001 );

		var d = Math.floor(j2 - j4 - Math.floor(j5*30.6001));
		var m = Math.floor(j5 - 1);
		if( m > 12 ) m -= 12;
		var y = Math.floor(j3 - 4715);
		if( m > 2 )   --y;
		if( y <= 0 )  --y;

		//
		// get time of day from day fraction
		//
		var hr  = Math.floor(dayfrac * 24.0);
		var mn  = Math.floor((dayfrac*24.0 - hr)*60.0);
		var f  = ((dayfrac*24.0 - hr)*60.0 - mn)*60.0;
		var sc  = Math.floor(f);
			 f -= sc;
	    if( f > 0.5 ) ++sc;

	    return {
	    	year: y,
	    	month: m,
	    	day: d,
	    	hour: hr,
	    	minute: mn,
	    	sec: sc
	    };
	}

var now = new Date(); //set any date

xpl.now = jday(now.getUTCFullYear(),
            now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds());

xpl.updateTime = function (_deltaSeconds){
	var deltaSeconds = typeof _deltaSeconds !== 'undefined' ?  deltaSeconds : 0;
	var updatedDate = new Date(); //set any date
	xpl.now = jday(updatedDate.getUTCFullYear(),
	            updatedDate.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
	            updatedDate.getUTCDate(),
	            updatedDate.getUTCHours(),
	            updatedDate.getUTCMinutes(),
	            updatedDate.getUTCSeconds()+deltaSeconds);
};