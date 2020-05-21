const Person = require('./Person.js').default;
const AirGrid = require('./AirGrid.js');

module.exports.process = async (data) => {
    // let square = new AirGrid.Square(3)
    // console.log(data);
    // let p = new Person(2, 3, 4,5,6,7,8);
    // console.log(p.toString());
    return true;
};

function sA(r, x, y){
    var a;
    if(x < 0){
        return -sA(r, -x, y);
    }
    if (y < 0) {
		return -sA(r, x, -y);
	}
	if (x > r) {
		x = r;
	}

	if (y > r) {
		y = r;
    
    if (x*x + y*y > r*r) {
		a = r*r*asin(x/r) + x*sqrt(r*r-x*x) + r*r*asin(y/r) + y*sqrt(r*r-y*y) - r*r*M_PI_2;
		a *= 0.5;
	} else {
		a = x*y;
	}
	return a;
}
/*
Given P_rect_top_left(x1, y1), P_rect_bottom_right(x2, y2), 
P_circle_center(mx, my) and radius(r), calc(x1, y1, x2, y2, mx, my, r) 
returns the area of intersection.
*/
function calc(){x1, y1, x2, y2, mx, my, r}{ 
    x1-=mx; x2-=mx; y1-=my; y2-=my;
	return sA(r, x2, y1) - sA(r, x1, y1) - sA(r, x2, y2) + sA(r, x1, y2);
}