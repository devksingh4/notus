class Person {
    constructor(nx, ny, ninf, ntargetx, ntargety, nkaren, size){ // coords are in meters, the karen modifier indicates the level of stubborness to anti-plague measures
        this.x = nx;
        this.y = ny;
        this.inf = ninf;
        this.targetx = ntargetx;
        this.targety = ntargety;
        this.karen = nkaren;
        this.size = size;
    }
    infect(p_aerosol, d_aerosol){ // p is probability constant for infection, d is density
        var check = Math.random();
        var chance = (1-p_aerosol)**(this.size * d_aerosol)
        if(check > chance && this.inf === false){
            this.inf = 0
        }
    }
    tick(delta_time){ // function called every time increment
        
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
    get karen(){
        return this.karen;
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
    set karen(nkaren){
        this.karen = nkaren;
    }
    set size(nsize){
        this.size = nsize;
    }
    toString() {
        return `${this.x}, ${this.y}, ${this.inf}, ${this.targetx}, ${this.targety}, ${this.karen}, ${this.size}`;
    }
}

class Population {
    constructor(pop_size, starting_pos, starting_tar, starting_karen, starting_size){
        this.pop = [];
        for(let i = 0; i < pop_size; i++){
            this.pop.push(new Person(starting_pos[i][0], starting_pos[i][1], starting_tar[i][0], starting_tar[i][1], starting_karen[i], starting_size[i]));
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
        removed = this.pop.splice(index, 1);
    }
    tick(dt){
        for(let i = 0; i < this.size(); i++){
            this.pop[i].tick();
        }
    }
}

module.exports.Person = Person;
module.exports.Population = Population;