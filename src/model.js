class Person {
    constructor(nx, ny, ninf, ntargetx, ntargety, nkaren){ // coords are in meters, the karen modifier indicates the level of stubborness to anti-plague measures
        this.x = nx;
        this.y = ny;
        this.targetx = ntargetx;
        this.targety = ntargety;
        this.karen = nkaren;
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
}