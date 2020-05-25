const PF = require("pathfinding");

class PathFinder{
  constructor(config, grid, sideLength){
    this.grid = grid;
    this.gridSideLength = sideLength;
    this.openDesks = [];
    this.takenDesks = [];
    this.openTablePositions = []
    this.takenTablePositions = []
    for (let item in config.items) {
      if (item.name === "Confrence Table") {
        this.openTablePositions.add([item.x, item.y, {"top_left": true, "bottom_left": true, "top_right":true, "bottom_right":true}])
      }
      if (item.name === "Office desk"){
        this.openDesks.push([item.x, item.y])
      }
    }
  }
  getSquareIndsFromCoords(x, y) {
    const yloc = Math.floor(y / this.gridSideLength);
    const xloc = Math.floor(x / this.gridSideLength);
    return [xloc, yloc];
  }

  getCoordsFromIndices(x,y) {
    const yloc = (y + .5) * this.gridSideLength;
    const xloc = (x + .5) * this.gridSideLength;
    return [xloc, yloc];
  }
   navigateTo(xc, yc, xg, yg) {

    var finder = new PF.AStarFinder({
      allowDiagonal: true,
      heuristic: PF.Heuristic.euclidean
    });
    const start = this.getSquareIndsFromCoords(xc,yc);
    const end =  this.getSquareIndsFromCoords(xg,yg);
    const path =  finder.find_path(start[0], start[1], end[0], end[1], this.grid)
    let coordTargets=[]
    for (var i = 0; i < path.length; i++) {
      coordTargets.push(this.getCoordsFromIndices(path[i][0], path[i][1]));
    }
    return coordTargets;
  }

   nextStep(xc, yc, xg, yg){
    return this.navigateTo(xc, yc, xg, yg)[0];
  }

  reserveDesk(){
    if (this.openDesks===[]) {
      return null
    }
    const index = Math.floor(Math.random() * this.openDesks.length);
    const selection = this.openDesks[index];
    this.openDesks.splice(index,1);
    this.takenDesks.push(selection);
    return selection;
  }

  unReserveDesk(desk){
    const index = this.takenDesks.indexOf(desk);
    if (index >=0) {
      this.takenDesks.splice(index,1);
      this.openDesks.push(desk);
    }else{
      console.error("desk was never reserved");
    }
  }

  reserveAndNavigateToDesk(xc,yc){
    const desk = this.reserveDesk();
    if (desk ===null){
      return desk;
    }else{
      return [desk, this.navigateTo(xc,yc,desk[0],desk[1])]
    }
  }
}
