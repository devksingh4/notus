const glMatrix = require("gl-matrix")
const wpool = require("workerpool")
const mapParallel = (func, data) => {
  var wp = wpool.pool();
  var promises = data.map(x => wp.exec(func, [x]))
  var allPromises = Promise.all(promises)
  return allPromises.then((val) => {
    wp.terminate();
    return val;
  })
}

class Square {
  constructor(sideLength) {
    this.nCoronaParticles = 0;
    this.coronaVel = glMatrix.vec2.create();
    this.sideLength = sideLength;
  }

  getNCoronaParticles() {
    return this.nCoronaParticles;
  }

  get getVelocity() {
    return this.coronaVel;
  }
  set removeParticles(nparticles) {
    this.nCoronaParticles -= nparticles;
  }

  cough(nparticles, newDirection) {
    let weightedNew = glMatrix.vec2.create();
    let weightedOld = glMatrix.vec2.create();
    let momentumSum = glMatrix.vec2.create();
    //preserve momentum
    glMatrix.vec2.mul(weightedNew, newDirection, nparticles);
    glMatrix.vec2.mul(weightedOld, glMatrix.vec2.clone(this.coronaVel), this.nCoronaParticles);
    glMatrix.vec2.add(momentumSum, weightedNew, weightedOld);
    glMatrix.vec2.divide(this.coronaVel, momentumSum, weightedNew + weightedOld);
  }

  tickstage0(dt) {
    const numLeave = Math.round(Math.max(this.coronaVel.len() * dt / this.sideLength, 1) * this.nCoronaParticles);
    const nUD = Math.floor(numLeave * this.safeDiv((this.coronaVel[1]), (this.coronaVel[0] + this.coronaVel[1])));
    const nLR = Math.ceil(numLeave * this.safeDiv((this.coronaVel[0]), (this.coronaVel[0] + this.coronaVel[1])));
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
    const move = Math.round(dt * dispersalConst * this.nCoronaParticles);
    return [move, move, move, move];
  }

  tickstage2(dt, wrConst, airForce, halfLife) {
    //f_wr = cv^2, f=ma, a = dv/dt
    let normVel;
    glMatrix.vec2.normalize(normVel, glMatrix.vec2.clone(this.coronaVel));
    let wrVec = glMatrix.Vec2.create();
    glMatrix.vec2.mul(wrVec, normVel, glMatrix.vec2.sqrLen(this.coronaVel) * wrConst * dt);
    glMatrix.vec2.sub(this.coronaVel, this.coronaVel, wrVec);
    let distAirForce;
    //f=ma, a = dv/dt
    glMatrix.vec2.mul(distAirForce, airForce, this.safediv(dt, this.nCoronaParticles));
    glMatrix.vec2.add(this.coronaVel, this.coronaVel, distAirForce);
    //half life is in seconds
    this.nCoronaParticles = Math.floor(Math.pow(2, -dt / halfLife) * this.nCoronaParticles);
    return 0;
  }
  safeDiv(a, b) {
    return b === 0 ? 0 : a / b
  }
  toString() {
    return `Has side length ${this.sideLength} with ${this.nCoronaParticles} Coronavirus Particles. Velocity is ${this.coronaVel}.`
  }
}

class OccludedSquare extends Square {
  constructor(sideLength, topOcclusion, bottomOcclusion, rightOcclusion, leftOcclusion, areaOcclusion) {
    //Occlusions are numbers between 0 and 1, the fraction of how much is blocked
    super(sideLength);
    this.topOcclusion = topOcclusion;
    this.bottomOcclusion = bottomOcclusion;
    this.rightOcclusion = rightOcclusion;
    this.leftOcclusion = leftOcclusion;
    this.areaOcclusion = areaOcclusion;
  }

  tickstage0(dt) {
    const numLeave = Math.max(this.coronaVel.len() * dt / this.sideLength, 1) * this.nCoronaParticles;
    const nUD = Math.floor(numLeave * this.safeDiv((this.coronaVel[1]), (this.coronaVel[0] + this.coronaVel[1])));
    const nLR = Math.ceil(numLeave * this.safeDiv((this.coronaVel[0]), (this.coronaVel[0] + this.coronaVel[1])));
    if (nUD >= 0 && nLR >= 0) {
      const nTop = Math.round(nUD * this.topOcclusion);
      const nRight = Math.round(nLR * this.rightOcclusion);
      this.removeParticles(nUD + nLR - nTop - nRight);
      this.cough(nUD - nTop, glMatrix.fromValues(this.coronaVel[0], -this.coronaVel[1]))
      this.cough(nLR - nRight, glMatrix.fromValues(-this.coronaVel[0], this.coronaVel[1]))
      return [nTop, nRight, 0, 0];
    } else if (nUD >= 0) {
      const nTop = Math.round(nUD * this.topOcclusion);
      const nLeft = Math.round(-nLR * this.rightOcclusion);
      this.removeParticles(nUD + nLR - nTop - nLeft);
      this.cough(nUD - nTop, glMatrix.fromValues(this.coronaVel[0], -this.coronaVel[1]))
      this.cough(nLR - nLeft, glMatrix.fromValues(-this.coronaVel[0], this.coronaVel[1]))
      return [nTop, 0, 0, nLeft];
    } else if (nLR >= 0) {
      const nBottom = Math.round(-nUD * this.topOcclusion);
      const nRight = Math.round(nLR * this.rightOcclusion);
      this.removeParticles(nUD + nLR - nBottom - nRight);
      this.cough(nUD - nBottom, glMatrix.fromValues(this.coronaVel[0], -this.coronaVel[1]))
      this.cough(nLR - nRight, glMatrix.fromValues(-this.coronaVel[0], this.coronaVel[1]))
      return [0, nRight, nBottom, 0];
    } else {
      const nBottom = Math.round(-nUD * this.topOcclusion);
      const nLeft = Math.round(-nLR * this.rightOcclusion);
      this.removeParticles(nUD + nLR - nBottom - nLeft);
      this.cough(nUD - nBottom, glMatrix.fromValues(this.coronaVel[0], -this.coronaVel[1]))
      this.cough(nLR - nLeft, glMatrix.fromValues(-this.coronaVel[0], this.coronaVel[1]))
      return [0, 0, nBottom, nLeft];
    }
  }

  tickstage1(dt, dispersalConst) {
    const multiplier = (4 - this.leftOcclusion - this.rightOcclusion - this.topOcclusion - this.bottomOcclusion) / 4;
    const move = dt * dispersalConst * this.safediv(this.nCoronaParticles, (1 - this.areaOcclusion) * multiplier);
    return [Math.floor(move / (1 - this.topOcclusion)), Math.floor(move / (1 - this.rightOcclusion)), Math.floor(move / (1 - this.bottomOcclusion)), Math.floor(move / (1 - this.leftOcclusion))];
  }
}

class Wall extends OccludedSquare {
  constructor(sideLength) {
    super(sideLength, 1, 1, 1, 1, 1);
  }
  tickstage0(dt) {
    return [0, 0, 0, 0];
  }
  tickstage1(dt) {
    return [0, 0, 0, 0];
  }
}

class Outflow extends Square {
  tickstage2(dt) {
    const cp = this.nCoronaParticles;
    this.nCoronaParticles = 0;
    return cp;
  }
}

class AirGrid {
  constructor(width, height, sideLength, dispersalConst, wrConst, halfLife) {
    const nw = Math.ceil(width / sideLength);
    const nh = Math.ceil(height / sideLength);
    this.grid = [];
    this.airflowGrid = [];
    this.intakes = {};
    this.outflows = {};
    this.airflowRemovedCount = 0;
    this.particleCreatedCount = 0;
    for (let i = 0; i < nh; i++) {
      let newSquares = [];
      let newAir = [];
      for (let j = 0; j < nw; j++) {
        newSquares.push(new Square(sideLength));
        newAir.push(glMatrix.vec2.create());
      }
      this.grid.push(newSquares);
      this.airflowGrid.push(newAir);
    }
    this.dispersalConst = dispersalConst;
    this.wrConst = wrConst;
    this.halfLife = halfLife;
    this.sideLength = sideLength;
  }

  get getAirflow() {
    return this.airflowGrid;
  }

  get getGrid() {
    return this.grid;
  }

  get getAirIntakes() {
    return this.intakes
  }

  get getAirOutflows() {
    return this.outflows
  }

  addIntake(row, col, strength) {
    this.intakes[[row, col]] = strength;
  }

  addOutflow(row, col, strength) {
    this.outflows[[row, col]] = strength;
    this.grid[row][col] = new Outflow(this.sideLength);
  }

  remIntake(row, col) {
    delete this.intakes[[row, col]];
  }

  remOutflow(row, col) {
    delete this.outflows[[row, col]]
    this.grid[row][col] = new Square(this.sideLength);
  }

  calcSquareAirflow(rc) {
    const row = rc[0];
    const col = rc[1];
    const sqX = this.getCoordsFromIndices(row, col)[0];
    const sqY = this.getCoordsFromIndices(row, col)[1];
    let cSq = glMatrix.vec2.fromValues(sqX, sqY);
    let outvec = glMatrix.vec2.create();
    for (const [coords, str] of Object.entries(this.intakes)) {
      const infX = this.getCoordsFromIndices(coords[0], coords[1])[0];
      const infY = this.getCoordsFromIndices(coords[0], coords[1])[1];
      let cInf = glMatrix.vec2.fromValues(infX, infY);
      let diffVec = glMatrix.vec2.create();
      glMatrix.vec2.sub(diffVec, cSq, cInf);
      let addOn = glMatrix.vec2.create();
      let dvNorm = glMatrix.vec2.create();
      glMatrix.vec2.normalize(dvNorm, diffVec)
      glMatrix.vec2.mul(addOn, dvNorm, str / glMatrix.vec2.sqrLen(diffVec))
      glMatrix.vec2.add(outvec, addOn, outvec);
    }
    for (const [coords, str] of Object.entries(this.outflows)) {
      const infX = this.getCoordsFromIndices(coords[0], coords[1])[0];
      const infY = this.getCoordsFromIndices(coords[0], coords[1])[1];
      let cOuf = glMatrix.vec2.fromValues(infX, infY);
      let diffVec = glMatrix.vec2.create();
      glMatrix.vec2.sub(diffVec, cOuf, cSq);
      let addOn = glMatrix.vec2.create();
      let dvNorm = glMatrix.vec2.create();
      glMatrix.vec2.normalize(dvNorm, diffVec)
      glMatrix.vec2.mul(addOn, dvNorm, str / glMatrix.vec2.sqrLen(diffVec))
      glMatrix.vec2.add(outvec, addOn, outvec);
    }
    this.airflowGrid[row][col] = outvec;
    return true;
  }

  calcAirflow() {
    let locations = [];
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        locations.push([i, j])
      }
    }
    mapParallel(this.calcSquareAirflow, locations);
  }

  tickCell0 = function(yxdt) {
    const y = yxdt[0];
    const x = yxdt[1];
    const dt = yxdt[2];
    return this.grid[y][x].tickstage0(dt);
  }

  tickCell1 = function(yxdt) {
    const y = yxdt[0];
    const x = yxdt[1];
    const dt = yxdt[2];
    return this.grid[y][x].tickstage1(dt, this.dispersalConst);
  }

  tickCell2 = function(yxdt) {
    const y = yxdt[0];
    const x = yxdt[1];
    const dt = yxdt[2];
    const ret = this.grid[y][x].tickstage2(dt, this.wrConst, this.airflowGrid[y][x], this.halfLife);
    this.airflowRemovedCount += ret;
    return ret;
  }

  tick(dt) {
    let locations = [];
    //create a grid of locations
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        locations.push([i, j, dt])
      }
    }
    const t0upd = mapParallel(this.tickCell0, locations.slice())
    this.updateGrid(t0upd)
    const t1upd = mapParallel(this.tickCell1, locations.slice())
    this.updateGrid(t1upd)
    const t2upd = mapParallel(this.tickCell2, locations.slice())
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
        this.grid()[row][col].removeParticles(upd[i][3] + upd[i][2] + upd[i][1] + upd[i][0]);
      }));
    }
    Promise.all(promises).then((val) => {
      pool.terminate();
    });
  }

  getSquareFromCoords(x, y) {
    const yloc = Math.floor(y / this.sideLength);
    const xloc = Math.floor(x / this.sideLength);
    return this.grid[yloc][xloc];
  }

  getSquareIndsFromCoords(x, y) {
    const yloc = Math.floor(y / this.sideLength);
    const xloc = Math.floor(x / this.sideLength);
    return [yloc, xloc];
  }

  getCoordsFromIndices(y, x) {
    const yloc = (y + .5) * this.sideLength;
    const xloc = (x + .5) * this.sideLength;
    return [xloc, yloc];
  }

  coughAt(x, y, nparticles, vel) {
    let square = this.getSquareFromCoords(x, y);
    this.particleCreatedCount += nparticles;
    square.cough(nparticles, vel);
  }
  occlude(row, col, top, bottom, right, left, area) {
    const vel = this.grid[row][col].coronaVel;
    const nP = this.grid[row][col].nCoronaParticles;
    let os = new OccludedSquare(this.sideLength, top, bottom, left, right, area);
    os.coronaVel = vel;
    os.nCoronaParticles = nP;
    this.grid[row][col] = os;
  }

  setWall(row, col) {
    this.grid[row][col] = new Wall(this.sideLength);
  }

  get getAirflowRemovedCount() {
    return this.airflowRemovedCount;
  }

  get getParticleCreatedCount() {
    return this.particleCreatedCount;
  }
  getLinearFlow(){
    let out = []
    for (var row in this.grid) {
      out.concat(row)
    }
    return out
  }
  toString() {
    return `Has ${this.grid.length} rows and ${this.grid.length[0]} columns with side length ${this.sideLength}. Dispersal Coefficient is ${this.dispersalConst} and Coefficient of Wind Resistance is ${this.wrConst}`
  }
}
module.exports.Square = Square;
module.exports.OccludedSquare = OccludedSquare;
module.exports.AirGrid = AirGrid;
