const glMatrix = require("gl-matrix")
const wpool = require("workerpool")
const mapParallel = require('./MapParallel.js').default;
class Square {
  constructor(sideLength) {
    this.nCoronaParticles = 0;
    this.coronaVel = glMatrix.vec2.create();
    this.sideLength = sideLength;
  }

  get getNCoronaParticles() {
    return this.nCoronaParticles;
  }

  get getVelocity() {
    return this.coronaVel;
  }
  set removeParticles(nparticles) {
    this.nCoronaParticles -= nparticles;
  }

  cough(nparticles, newDirection) {
    var weightedNew = glMatrix.vec2.create();
    var weightedOld = glMatrix.vec2.create();
    var momentumSum = glMatrix.vec2.create();
    //preserve momentum
    glMatrix.vec2.mul(weightedNew, newDirection, nparticles);
    glMatrix.vec2.mul(weightedOld, glMatrix.vec2.clone(this.coronaVel), this.nCoronaParticles);
    glMatrix.vec2.add(momentumSum, weightedNew, weightedOld);
    glMatrix.vec2.divide(this.coronaVel, momentumSum, weightedNew + weightedOld);
  }

  tickstage0(dt) {
    var numLeave = Math.max(this.coronaVel.len() * dt / this.sideLength, 1) * this.nCoronaParticles;
    var nUD = numLeave * (this.coronaVel[1]) / (this.coronaVel[0] + this.coronaVel[1]);
    var nLR = numLeave - nUD;
    if (nUD >= 0 && nLR >= 0) {
      return [nUD, nLR, 0, 0];
    } else if (nUD >= 0) {
      return [nUD, 0, 0, -nLR];
    } else if (nLR >= 0) {
      return [0, nLR, -nUD, 0];
    } else {
      return [0, 0, -nUD, -nLR];
    }
  }

  tickstage1(dt, dispersalConst) {
    var move = dt * dispersalConst * this.nCoronaParticles;
    return [move, move, move, move];
  }

  tickstage2(dt, wrConst, airForce) {
    //f_wr = cv^2, f=ma, a = dv/dt
    var normVel;
    glMatrix.vec2.normalize(normVel, glMatrix.vec2.clone(this.coronaVel));
    var wrVec = glMatrix.Vec2.create();
    glMatrix.vec2.mul(wrVec, normVel, this.coronaVel.sqrDist() * wrConst * dt);
    glMatrix.vec2.sub(this.coronaVel, this.coronaVel, wrVec);
    var distAirForce;
    //f=ma, a = dv/dt
    glMatrix.vec2.mul(distAirForce, airForce, dt / this.nCoronaParticles);
    glMatrix.vec2.add(this.coronaVel, this.coronaVel, distAirForce);
  }
  toString() {
    return `Has side length ${this.sideLength} with ${this.nCoronaParticles} Coronavirus Particles. Velocity is ${this.coronaVel}.`
  }
}

class AirGrid {
  constructor(width, height, sideLength, dispersalConst, wrConst) {
    var nw = Math.ceil(width / sideLength);
    var nh = Math.ceil(height / sideLength);
    this.grid = [];
    this.airflowGrid = []
    for (var i = 0; i < nh; i++) {
      var newSquares = [];
      var newAir = [];
      for (var j = 0; j < nw; j++) {
        newSquares.push(new Square(sideLength));
        newAir.push(glMatrix.vec2.create());
      }
      this.grid.push(newSquares);
      this.airflowGrid.push(newAir)
    }
    this.dispersalConst = dispersalConst
    this.wrConst = wrConst
  }
  get getAirflow() {
    return this.airflowGrid;
  }
  get getGrid() {
    return this.grid;
  }
  tickCell0 = function(xydt) {
    const x = xydt[0];
    const y = xydt[1];
    const dt = xydt[2];
    return this.grid.y.x.tickstage0(dt);
  }
  tickCell1 = function(xydt) {
    const x = xydt[0];
    const y = xydt[1];
    const dt = xydt[2];
    return this.grid.y.x.tickstage1(dt, this.dispersalConst);
  }
  tickCell2 = function(xydt) {
    const x = xydt[0];
    const y = xydt[1];
    const dt = xydt[2];
    return this.grid.y.x.tickstage2(dt, this.wrConst, this.airflowGrid[y][x]);
  }
  tick(dt) {
    let locations = []
    //create a grid of locations
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        locations.push([i, j, dt])
      }
    }
    var t0upd = mapParallel(this.tickCell0, locations.slice())
    this.updateGrid(t0upd)
    var t1upd = mapParallel(this.ickCell1, locations.slice())
    this.updateGrid(t1upd)
    var t2upd = mapParallel(this.tickCell2, locations.slice())
    this.updateGrid(t2upd)
  }
  updateGrid(upd) {
    let pool = wpool.pool()
    let promises = []
    for (let i = 0; i < upd.length; i++) {
      promises.push(pool.exec(() => {
        let col = i % this.grid[0].length;
        let row = Math.floor(i / this.grid[0].length);
        try {
          this.grid[row - 1][col].cough(upd[i][0], this.grid[row][col].getVelocity());
        } catch (e) {}
        try {
          this.grid[row][col + 1].cough(upd[i][1], this.grid[row][col].getVelocity());
        } catch (e) {}
        try {
          this.grid[row + 1][col].cough(upd[i][2], this.grid[row][col].getVelocity());
        } catch (e) {}
        try {
          this.grid[row][col - 1].cough(upd[i][3], this.grid[row][col].getVelocity());
        } catch (e) {}
      }));
      return Promise.all(promises).then((val) => {
        this.grid[row][col].removeParticles(upd[i][3]+upd[i][2]+upd[i][1]+upd[i][0])
        pool.terminate()
        return val;
      })
    }
  }
}
module.exports.Square = Square;
module.exports.AirGrid = AirGrid;
