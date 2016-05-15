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
	if(typeof year === 'undefined'){year = 0;}
	if(typeof mon === 'undefined'){mon = 0;}
	if(typeof day === 'undefined'){day = 0;}
	if(typeof hr === 'undefined'){hr = 0;}
	if(typeof minute === 'undefined'){minute = 0;}
	if(typeof sec === 'undefined'){sec = 0;}

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