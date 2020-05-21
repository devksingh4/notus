const glMatrix = require("gl-matrix")

class Square {
  constructor(sideLength) {
    this.nCoronaParticles = 0;
    this.coronaVel = glMatrix.vec2.create();
    this.sideLength = sideLength;
  }

  function getNCoronaParticles() {
    return this.nCoronaParticles;
  }

  function getDirection() {
    return this.coronaVel;
  }

  function removeParticles(nparticles) {
    this.nCoronaParticles -= nparticles;
  }

  function cough(nparticles, newDirection) {
    var weightedNew = glMatrix.vec2.create();
    var weightedOld = glMatrix.vec2.create();
    var momentumSum = glMatrix.vec2.create();
    //preserve momentum
    glMatrix.vec2.mul(weightedNew, newDirection, nparticles);
    glMatrix.vec2.mul(weightedOld, glMatrix.vec2.clone(this.coronaVel), this.nCoronaParticles);
    glMatrix.vec2.add(momentumSum, weightedNew, weightedOld);
    glMatrix.vec2.divide(this.coronaVel, momentumSum, weightedNew + weightedOld);
  }

  function tickstage0(dt) {
    var numLeave = Math.max(this.coronaVel.len() * dt / this.sideLength, 1) * nparticles;
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

  function tickstage1(dt, dispersalConst) {
    var move = dt * dispersalConst * this.nCoronaParticles;
    return [move, move, move, move];
  }

  function tickstage2(dt, wrConst, airForce) {
    //f_wr = cv^2, f=ma, a = dv/dt
    var normVel;
    glMatrix.vec2.normalize(normVel, glMatrix.vec2.clone(this.coronaVel));
    var wrVec = glMatrix.Vec2.create();
    glMatrix.vec2.mul(wrVec, normVel, this.coronaVel.sqrDist() * wrConst*dt );
    glMatrix.vec2.sub(this.coronaVel, this.coronaVel, wrVec);
    var distAirForce;
    //f=ma, a = dv/dt
    glMatrix.vec2.mul(distAirForce, airForce, dt/this.nCoronaParticles);
    glMatrix.vec2.add(this.coronaVel, this.coronaVel, distAirForce);
  }
}
