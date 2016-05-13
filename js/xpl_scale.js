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