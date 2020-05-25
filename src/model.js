const Population = require('./Person.js').Population;
const AirGrid = require('./AirGrid.js').AirGrid;
const wallProcess = require('./wallProcess.js')
const fs = require('fs');
// TODO REMOVE WHEN THERE IS HEFT TO process()!!!
function sleep(seconds)
{
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}
function getModelConfig() {
    return JSON.parse(fs.readFileSync("model-config.json"));
}
module.exports.process = async (data) => {
    const modelConfig = getModelConfig(); // n_employees, percent_infected, etc. 
    sleep(1) // Temoorary intense calculation boilerplate TODO REMOVE!!!
    return {success:true, data: {prob: 1, nearPasses: 0.05}};
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
    }
    if (x*x + y*y > r*r) {
        a = r*r*Math.asin(x/r) + x*Math.sqrt(r*r-x*x) + r*r*Math.asin(y/r) + y*Math.sqrt(r*r-y*y) - r*r*Math.PI;
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
const calc = (x1, y1, x2, y2, mx, my, r) => {
    x1-=mx; x2-=mx; y1-=my; y2-=my;
	return sA(r, x2, y1) - sA(r, x1, y1) - sA(r, x2, y2) + sA(r, x1, y2);
}

function tick(t, dt, pop, ag){
  pop.tick(t,dt);
  ag.tick(dt);

}
