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
        var chance = (1-p_aerosol)**(size * d_aerosol)
        if(check > chance && self.inf == False){
            self.inf = 0
        }
    }
    inc(delta_time){ // function called every time increment
        
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
        self.x = nx;
    }
    set y(ny){
        self.y = ny;
    }
    get inf(ninf){
        this.inf = ninf;
    }
    get targetx(ntargetx){
        this.targetx = ntargetx;
    }
    get targety(ntargety){
        this.targety = ntargety;
    }
    get karen(nkaren){
        this.karen = nkaren;
    }
    get size(nsize){
        this.size = nsize;
    }
}