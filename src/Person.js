const AirGrid = require('./AirGrid.js').AirGrid;
const glMatrix = require('gl-matrix')
class Person {
    constructor(nx, ny, ninf, ntargetx, ntargety, nnon_compliant, size, airgrid, naviGrid){ // coords are in meters, the non_compliant modifier indicates the level of stubborness to anti-plague measures
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

    }
    infect(p_aerosol, d_aerosol){ // p is probability constant for infection, d is density
        var check = Math.random();
        let spread_const = this.non_compliant ? .3 : .1;
        var chance = (1-p_aerosol)**(this.size * d_aerosol* spread_const)
        if(check > chance && this.inf === false){
            this.inf = 0
        }
    }
    tick(time, delta_time){ // function called every time increment
        const cough_limit = this.generate_aerosols(1/10, delta_time);
        const roll = Math.random();
        if(roll < cough_limit){
          //non-compliants don't wear masks. TODO: allow user to change this
          let directionFacing = glMatrix.vec2.create();
          let cpos = glMatrix.vec2.fromValues(this.x, this.y);
          let tpos = glMatrix.vec2.fromValues(this.targetx, this.targety);
          glMatrix.vec2.sub(directionFacing, tpos, cpos);
          glMatrix.vec2.normalize(directionFacing,directionFacing);
          if (this.non_compliant){
            this.airGrid.coughAt(this.x,this.y, 2000, directionFacing)
          }else {
            glMatrix.vec2.mul(directionFacing, .2)
            this.airGrid.coughAt(this.x, this.y, 200, directionFacing)
          }
        }
        let newVec;
        let cp;
        let step = glMatrix.vec2.create();
        if(this.isWithinErrorOfTarget(.01)){
          if (this.directions != []){
            const newCoords = this.directions.pop();
            newVec = glMatrix.vec2.fromValues(newCoords[0], newCoords[1]);
            cp = glMatrix.vec2.fromValues(this.x, this.y);
            glMatrix.vec2.sub(step, newVec, cp);
          }
          else{
            newVec = glMatrix.vec2.fromValues(this.targetx, this.targety);
            cp = glMatrix.vec2.fromValues(this.x, this.y);
            glMatrix.vec2.sub(step, newVec, cp);
            
          }
        }else{
          newVec = glMatrix.vec2.fromValues(this.targetx, this.targety);
          cp = glMatrix.vec2.fromValues(this.x, this.y);
          glMatrix.vec2.sub(step, newVec, cp);
        }
        if (glMatrix.vec2.sqrLen(step) < this.maxspeed*this.maxspeed*delta_time) {
          this.x = this.targetx;
          this.y = this.targety;
        }else{
          glMatrix.vec2.normalize(step,step);
          glMatrix.vec2.mul(step, this.maxspeed*delta_time);
          let newpos = glMatrix.vec2.create();
          glMatrix.vec2.add(newpos, step, cp);
          this.x = newpos[0];
          this.y = newpos[1];
        }
    }

    isWithinErrorOfTarget(eps){
      return Math.abs(this.x-this.targetx) < eps && Math.abs(this.y-this.targety) < eps
    }

    generate_aerosols(p, delta_time){

        const x = this.inf / 86400;
        const z = p * delta_time

        if(x === false){
            return 0;
        }

        const a = 1.1;
        const b = 9.1;
        const c = 1.28;
        const d = 0.31;
        const k = -6.5;
        const n = 7.5;
        const v = 0.5;

        if(x >= 0 && x <= 2/3){
            const h = n * Math.E**-((x-c)**2/d);
            return h/100*z;
        }
        else if(x > 2/3 && x <= 11){
            const f = n * Math.E**-((x - a)**2 / b);
            const i = ( 2 * a * n * Math.E**-((a-x)**2/b) )/b - ( 2 * n * x * Math.E**-((a-x)**2/b) )/b;
            const g = f + k*i + v;
            return g/100*z;
        }
        else if(x > 11 && x <= 16){
            const m = -0.1*x + 1.6;
            return m/100*z;
        }
        else if(x > 16){
            return 0;
        }
        else{
            throw new Error("somehow Person.inf was negative");
        }
    }
    get x(){
        return this.x;
    }
    get y(){
        return this.y;
    }
    get inf(){
        return this.inf;
    }
    get targetx(){
        return this.targetx;
    }
    get targety(){
        return this.targety;
    }
    get non_compliant(){
        return this.non_compliant;
    }
    get size(){
        return this.size;
    }
    set x(nx){
        this.x = nx;
    }
    set y(ny){
        this.y = ny;
    }
    set inf(ninf){
        this.inf = ninf;
    }
    set targetx(ntargetx){
        this.targetx = ntargetx;
    }
    set targety(ntargety){
        this.targety = ntargety;
    }
    set non_compliant(n_non_compliant){
        this.non_compliant = n_non_compliant;
    }
    set size(nsize){
        this.size = nsize;
    }
    toString() {
        return `${this.x}, ${this.y}, ${this.inf}, ${this.targetx}, ${this.targety}, ${this.non_compliant}, ${this.size}`;
    }
}

class Population {
    constructor(pop_size, starting_pos, starting_tar, starting_non_compliant, starting_size, airGrid, naviGrid){
        this.pop = [];
        for(let i = 0; i < pop_size; i++){
            this.pop.push(new Person(starting_pos[i][0], starting_pos[i][1], starting_tar[i][0], starting_tar[i][1], starting_non_compliant[i], starting_size[i], airGrid, naviGrid));
        }
    }
    get size(){
        return this.pop.length;
    }
    get_pop(index){
        return this.pop[index];
    }
    set_pop(index, npop){
        this.pop[index] = npop;
    }
    remove(index){
        return this.pop.splice(index, 1);
    }
    tick(time, dt){
        for(let i = 0; i < this.size(); i++){
            this.pop[i].tick(time, dt);
        }
    }
    get_num_sick(){
        var temp = 0;
        var total = 0;
        for(let p in this.pop){
            if(p.inf > 0){
                temp++;
            }
            total++;
        }
        return temp/total;
    }
}

module.exports.Person = Person;
module.exports.Population = Population;
