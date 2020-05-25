const AirGrid = require('./AirGrid.js').AirGrid;
const glMatrix = require('gl-matrix')
class Person {
  constructor(nx, ny, ninf, ntargetx, ntargety, nnon_compliant, size, airgrid, naviGrid, infp) { // coords are in meters, the non_compliant modifier indicates the level of stubborness to anti-plague measures
    this.x = nx;
    this.y = ny;
    this.inf = ninf;
    this.targetx = ntargetx;
    this.targety = ntargety;
    this.non_compliant = nnon_compliant;
    this.size = size;
    this.airGrid = airgrid;
    this.naviGrid = naviGrid;
    this.directions = naviGrid.navigateTo(this.x, this.y, this.targetx, this.targety);
    this.maxspeed = 1
    this.directions.pop();
    this.current_hold = null;
    this.move_at = 0;
    this.inf_prob = infp
  }
  infect(p_aerosol, d_aerosol) { // p is probability constant for infection, d is density
    var check = Math.random();
    let spread_const = this.non_compliant ? .7 : .4;
    var chance = (1 - p_aerosol) ** (this.size * d_aerosol * spread_const)
    if (check > chance && this.inf === 0) {
      this.inf = .01
    }
  }
  tick(time, delta_time) { // function called every time increment
    const cough_limit = this.generate_aerosols(100, delta_time);
    const roll = Math.random();
    if (roll < cough_limit) {
      //non-compliants don't wear masks. TODO: allow user to change these #s
      let directionFacing = glMatrix.vec2.create();
      let cpos = glMatrix.vec2.fromValues(this.x, this.y);
      let tpos = glMatrix.vec2.fromValues(this.targetx, this.targety);
      glMatrix.vec2.sub(directionFacing, tpos, cpos);
      glMatrix.vec2.normalize(directionFacing, directionFacing);
      if (this.non_compliant) {
        this.airGrid.coughAt(this.x, this.y, 1000000, directionFacing)
      } else {
        glMatrix.vec2.mul(directionFacing, .2)
        this.airGrid.coughAt(this.x, this.y, 100000, directionFacing)
      }
    }
    if (this.inf !== 0) {
      this.inf += delta_time;
    }
    let newVec;
    let cp;
    let step = glMatrix.vec2.create();
    if (this.isWithinErrorOfTarget(.01)) {
      if (this.directions !== []) {
        const newCoords = this.directions.pop();
        if (!(newCoords === undefined)) {
          newVec = glMatrix.vec2.fromValues(newCoords[0], newCoords[1]);
          cp = glMatrix.vec2.fromValues(this.x, this.y);
          glMatrix.vec2.sub(step, newVec, cp);
        }
      } else {
        newVec = glMatrix.vec2.fromValues(this.targetx, this.targety);
        cp = glMatrix.vec2.fromValues(this.x, this.y);
        glMatrix.vec2.sub(step, newVec, cp);

      }
    } else {
      newVec = glMatrix.vec2.fromValues(this.targetx, this.targety);
      cp = glMatrix.vec2.fromValues(this.x, this.y);
      glMatrix.vec2.sub(step, newVec, cp);
      if (time > this.move_at) {
        this.move_at = Math.floor(Math.random() * (28800 - time)) + time;
        if (this.current_hold == null) {
          let desk = this.naviGrid.reserveDesk();
          if (desk != null) {
            this.current_hold = [desk, "desk"]
            let pf = this.naviGrid(this.x, this.y, desk[0], desk[1])
            pf.pop();
            this.directions = pf;
          }
        } else if (this.current_hold[1] == "desk") {
          this.naviGrid.unReserveDesk(this.current_hold[0]);
          let table = this.naviGrid.reserveTable();
          if (table != null) {
            this.current_hold = [
              [table[0], table[1]], "table", table[2]
            ]
            let pf = this.naviGrid(this.x, this.y, table[0], table[1])
            pf.pop();
            this.directions = pf;
          }
        } else {
          this.naviGrid.unReserveTablePos(this.current_hold[0], this.current_hold[2]);
          let desk = this.naviGrid.reserveDesk();
          if (desk != null) {
            this.current_hold = [desk, "desk"]
            let pf = this.naviGrid(this.x, this.y, desk[0], desk[1])
            pf.pop();
            this.directions = pf;
          }
        }
      }
    }
    if (glMatrix.vec2.sqrLen(step) < this.maxspeed * this.maxspeed * delta_time) {
      this.x = this.targetx;
      this.y = this.targety;
    } else {
      let stepNorm = glMatrix.vec2.create()
      glMatrix.vec2.normalize(stepNorm, step);
      let sD = glMatrix.vec2.create()
      sD = glMatrix.vec2.fromValues(stepNorm[0]*this.maxspeed*delta_time, stepNorm[1]*this.maxspeed*delta_time);
      let newpos = glMatrix.vec2.create();
      glMatrix.vec2.add(newpos, sD, cp);
      this.x = newpos[0];
      this.y = newpos[1];
    }
    let pc = 0;
    const radius = 1;
    const x0 = this.airGrid.getSquareIndsFromCoords(this.x, this.y)[0]
    const y0 = this.airGrid.getSquareIndsFromCoords(this.x, this.y)[1]
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius + Math.abs(i); j <= radius - Math.abs(i); j++){
        try {
          pc += this.airGrid.getGrid()[i][j].getNCoronaParticles();
        } catch (e) {

        }
      }
    }
    //const dens = this.airGrid.getSquareFromCoords(this.x, this.y).getNCoronaParticles();
    this.infect(this.inf_prob, pc);
  }

  isWithinErrorOfTarget(eps) {
    return Math.abs(this.x - this.targetx) < eps && Math.abs(this.y - this.targety) < eps
  }

  generate_aerosols(p, delta_time) {

    const x = this.inf / 86400;
    const z = p * delta_time

    if (x === false) {
      return 0;
    }

    const a = 1.1;
    const b = 9.1;
    const c = 1.28;
    const d = 0.31;
    const k = -6.5;
    const n = 7.5;
    const v = 0.5;

    if (x >= 0 && x <= 2 / 3) {
      const h = n * Math.E ** -((x - c) ** 2 / d);
      return h / 100 * z;
    } else if (x > 2 / 3 && x <= 11) {
      const f = n * Math.E ** -((x - a) ** 2 / b);
      const i = (2 * a * n * Math.E ** -((a - x) ** 2 / b)) / b - (2 * n * x * Math.E ** -((a - x) ** 2 / b)) / b;
      const g = f + k * i + v;
      return g / 100 * z;
    } else if (x > 11 && x <= 16) {
      const m = -0.1 * x + 1.6;
      return m / 100 * z;
    } else if (x > 16) {
      return 0;
    } else {
      throw new Error("somehow Person.inf was negative");
    }
  }
  toString() {
    return `${this.x}, ${this.y}, ${this.inf}, ${this.targetx}, ${this.targety}, ${this.non_compliant}, ${this.size}`;
  }
}

class Population {
  constructor(pop_size, starting_pos, starting_inf, starting_tar, starting_non_compliant, starting_size, airGrid, naviGrid, infp) {
    this.pop = [];
    pop_size = parseInt(pop_size);
    for (let i = 0; i < pop_size; i++) {
      this.pop.push(new Person(starting_pos[i][0], starting_pos[i][1], starting_inf[i], starting_tar[i][0], starting_tar[i][1], starting_non_compliant[i], starting_size[i], airGrid, naviGrid, infp));
    }
  }
  size() {
    return this.pop.length;
  }
  get_pop(index) {
    return this.pop[index];
  }
  set_pop(index, npop) {
    this.pop[index] = npop;
  }
  remove(index) {
    return this.pop.splice(index, 1);
  }
  tick(time, dt) {
    for (let i = 0; i < this.size; i++) {
      this.pop[i].tick(time, dt);
    }
    for (var i in this.pop) {
      for (var j in this.pop) {
        const ep = .5
        if (Math.abs(i.x - j.x) < ep && Math.abs(i.y - j.y) < ep) {
          if (i.targetx != j.targetx && i.targety != j.targety) {
            return false;
          }
        }
      }
    }
    return true;
  }
  get_num_sick() {
    var temp = 0;
    var total = 0;
    for (var i = 0; i < this.pop.length; i++) {
      temp += this.pop[i].inf > 0 ? 1 : 0;
    }
    return temp;
  }
}

module.exports.Person = Person;
module.exports.Population = Population;
