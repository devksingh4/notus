const Population = require('./Person.js').Population;
const AirGrid = require('./AirGrid.js').AirGrid;
const PathFinder = require('./pathfinding.js').PathFinder
const airGridFromJSON = require('./wallProcess.js').airGridFromJSON
const navgationGridFromJSON = require('./wallProcess.js').navgationGridFromJSON
const fs = require('fs');
// TODO REMOVE WHEN THERE IS HEFT TO process()!!!
function sleep(seconds) {
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}

function getModelConfig() {
  return JSON.parse(fs.readFileSync("model-config.json"));
}
module.exports.process = async (data) => {
  const modelConfig = getModelConfig(); // n_employees, percent_infected, etc.
  let ag = airGridFromJSON(data, modelConfig, 1);
  const fsLibrary  = require('fs')
  let df = "Hello world."
  fsLibrary.writeFile('newfile.txt', df)
  let pf = new PathFinder(navgationGridFromJSON(data, .1));
  let artsp = []
  let artforgotinf = []
  let arttp = []
  let artnc = []
  let artss = []
  for (var i = 0; i < modelConfig.n_employees; i++) {
    artsp.push([0, 0])
    artforgotinf.push(Math.random() < modelConfig.percent_infected / 100)
    arttp.push([1, 0])
    artnc.push(Math.random() < modelConfig.percent_noncompliant / 100)
    artss.push(1)
  }
  let pop = new Population(modelConfig.n_employees, artsp, artforgotinf, arttp, artnc, artss, ag, pf, modelConfig.p_infect)
  const dt = .1
  let npp = 0
  let npt = 0
  for (var i = 0; i < 28800; i += dt) {
    if (tick(i, dt, pop, pf)) {
      npp++
    }
    npt++
  }
  return {
    success: true,
    data: {
      prob: pop.get_num_sick() / pop.size(),
      nearPasses: npp / npt,
      airflow: ag.getAirflowRemovedCount / ag.getParticleCreatedCount
    }
  };
};

function sA(r, x, y) {
  var a;
  if (x < 0) {
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
  if (x * x + y * y > r * r) {
    a = r * r * Math.asin(x / r) + x * Math.sqrt(r * r - x * x) + r * r * Math.asin(y / r) + y * Math.sqrt(r * r - y * y) - r * r * Math.PI;
    a *= 0.5;
  } else {
    a = x * y;
  }
  return a;
}
/*
Given P_rect_top_left(x1, y1), P_rect_bottom_right(x2, y2),
P_circle_center(mx, my) and radius(r), calc(x1, y1, x2, y2, mx, my, r)
returns the area of intersection.
*/
const calc = (x1, y1, x2, y2, mx, my, r) => {
  x1 -= mx;
  x2 -= mx;
  y1 -= my;
  y2 -= my;
  return sA(r, x2, y1) - sA(r, x1, y1) - sA(r, x2, y2) + sA(r, x1, y2);
}

function tick(t, dt, pop, ag) {
  ag.tick(dt);
  return pop.tick(t, dt);

}
