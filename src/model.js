const Person = require('./Person.js');
const AirGrid = require('./airGrid.js').AirGrid;
module.exports.process = async (data) => {
    // console.log(data);
    // let p = new Person(2, 3, 4,5,6,7,8);
    // console.log(p.toString());
    return true;
};

function sim(config){
    let grid = populate(width, height, sideLength, dispersalConst, wr);

    delta_t = total_t / iters
    for(i = 0; i < iters; i++){

    }
}
function populate(width, height, sideLength, dispersalConst, wr){
    return new AirGrid(width, height, sideLength, dispersalConst, wr);
}