const AirGrid = require('./AirGrid.js').AirGrid;
const PF = require("./pathfinding.js");
const glMatrix = require("gl-matrix");

function airGridFromJSON(data, config, sideLength) {
  console.assert(data.output.unit === "cm", "unsupported unit");
  const width = Math.ceil(data.output.width / 100);
  const height = Math.ceil(data.output.height / 100);
  const cowr = config.cowr;
  const dispersal = config.dispersal;
  const halfLife = config.half_life;
  let ag = new AirGrid(width, height, dispersal, cowr, halfLife);
  const layer = data.output.layers[data.selectedLayer];
  for (var line in Object.values(layer.lines)) {
    if (line.type === "wall") {
      const thickness = line.properties.thickness.length / 100;
      const v0info = layer.vertices[line.vertices[0]];
      const pt0 = glMatrix.fromValues(v0info.x / 100, v0info.y / 100);
      const v1info = layer.vertices[line.vertices[1]];
      const pt1 = glMatrix.fromValues(v1info.x / 100, v1info.y / 100);

      let corner1l = glMatrix.create();
      let corner1r = glMatrix.create();
      let corner0l = glMatrix.create();
      let corner0r = glMatrix.create();

      let wallDir = glMatrix.create();
      let wallOrtho = glMatrix.create();

      glMatrix.vec2.sub(wallDir, pt0, pt1);
      glMatrix.vec2.normalize(wallDir, wallDir)
      glMatrix.vec2.rotate(wallOrtho, wallDir, glMatrix.vec2.create(), Math.PI / 2);
      glMatrix.vec2.mul(wallOrtho, wallOrtho, thickness / 2);

      glMatrix.vec2.add(corner0l, pt0, wallOrtho);
      glMatrix.vec2.sub(corner0r, pt0, wallOrtho);
      glMatrix.vec2.add(corner1l, pt0, wallOrtho);
      glMatrix.vec2.sub(corner1r, pt0, wallOrtho);

      let l0xOvers = {};
      let l0yOvers = {};

      for (let i = Math.floor(Math.min(corner0l[0], corner1l[0]) / sideLength) + sideLength; i <= Math.max(corner0l[0], corner1l[0]); i += sideLength) {
        const wgt = (i - Math.min(corner0l[0], corner1l[0])) / (Math.max(corner0l[0], corner1l[0]) - Math.min(corner0l[0], corner1l[0]));
        const ys = corner0l[0] > corner1l[0] ? corner1l[1] : corner0l[1];
        const yl = corner0l[0] < corner1l[0] ? corner1l[1] : corner0l[1];
        l0xOvers[i] = [i, wgt * ys + (1 - wgt) * yl];
      }
      for (let i = Math.floor(Math.min(corner0l[1], corner1l[1]) / sideLength) + sideLength; i <= Math.max(corner0l[1], corner1l[1]); i += sideLength) {
        const wgt = (i - Math.min(corner0l[1], corner1l[1])) / (Math.max(corner0l[1], corner1l[1]) - Math.min(corner0l[1], corner1l[1]));
        const xs = corner0l[1] > corner1l[1] ? corner1l[0] : corner0l[0];
        const xl = corner0l[1] < corner1l[1] ? corner1l[0] : corner0l[0];
        l0yOvers[i] = [wgt * xs + (1 - wgt) * xl, i];
      }
      let l1xOvers = {};
      let l1yOvers = {};

      for (let i = Math.floor(Math.min(corner0r[0], corner1r[0]) / sideLength) + sideLength; i <= Math.max(corner0r[0], corner1r[0]); i += sideLength) {
        const wgt = (i - Math.min(corner0r[0], corner1r[0])) / (Math.max(corner0r[0], corner1r[0]) - Math.min(corner0r[0], corner1r[0]));
        const ys = corner0r[0] > corner1r[0] ? corner1r[1] : corner0r[1];
        const yl = corner0r[0] < corner1r[0] ? corner1r[1] : corner0r[1];
        l1xOvers[i] = [i, wgt * ys + (1 - wgt) * yl];
      }
      for (let i = Math.floor(Math.min(corner0r[1], corner1r[1]) / sideLength) + sideLength; i <= Math.max(corner0r[1], corner1r[1]); i += sideLength) {
        const wgt = (i - Math.min(corner0r[1], corner1r[1])) / (Math.max(corner0r[1], corner1r[1]) - Math.min(corner0r[1], corner1r[1]));
        const xs = corner0r[1] > corner1r[1] ? corner1r[0] : corner0r[0];
        const xl = corner0r[1] < corner1r[1] ? corner1r[0] : corner0r[0];
        l1yOvers[i] = [wgt * xs + (1 - wgt) * xl, i];
      }
      for (var k in Object.keys(l0xOvers)) {
        // TODO: work on walls
      }
    }
  }
  for (var item in Object.values(layer.items)) {
    if (item.name === "Air intake") {
      const place = ag.getSquareIndsFromCoords(item.x, item.y)
      ag.addIntake(place[0], place[1], 1000) //third param may need to be changed
    }
  }
  if (item.name === "Air Outflow") {
    const place = ag.getSquareIndsFromCoords(item.x, item.y)
    ag.addOutflow(place[0], place[1], 1000) //third param may need to be changed
  }
}

function navgationGridFromJSON(data, sideLength) {
  console.assert(data.output.unit === "cm", "unsupported unit");
  const width = Math.ceil(data.output.width / 100 / sideLength);
  const height = Math.ceil(data.output.height / 100 / sideLength);
  let grid = PF.grid(width, height);
  const layer = data.output.layers[data.selectedLayer];
  for (var line in Object.values(layer.lines)) {
    if (line.name === "wall") {
      const thickness = line.properties.thickness.length / 100;
      const v0info = layer.vertices[line.vertices[0]];
      const pt0 = glMatrix.fromValues(v0info.x / 100, v0info.y / 100);
      const v1info = layer.vertices[line.vertices[1]];
      const pt1 = glMatrix.fromValues(v1info.x / 100, v1info.y / 100);

      let corner1l = glMatrix.create();
      let corner1r = glMatrix.create();
      let corner0l = glMatrix.create();
      let corner0r = glMatrix.create();

      let wallDir = glMatrix.create();
      let wallOrtho = glMatrix.create();

      glMatrix.vec2.sub(wallDir, pt0, pt1);
      glMatrix.vec2.normalize(wallDir, wallDir)
      glMatrix.vec2.rotate(wallOrtho, wallDir, glMatrix.vec2.create(), Math.PI / 2);
      glMatrix.vec2.mul(wallOrtho, wallOrtho, thickness / 2);

      glMatrix.vec2.add(corner0l, pt0, wallOrtho);
      glMatrix.vec2.sub(corner0r, pt0, wallOrtho);
      glMatrix.vec2.add(corner1l, pt0, wallOrtho);
      glMatrix.vec2.sub(corner1r, pt0, wallOrtho);

      let l0xOvers = {};
      let l0yOvers = {};

      for (let i = Math.floor(Math.min(corner0l[0], corner1l[0]) / sideLength); i <= Math.max(corner0l[0], corner1l[0]); i += sideLength) {
        const wgt = (i - Math.min(corner0l[0], corner1l[0])) / (Math.max(corner0l[0], corner1l[0]) - Math.min(corner0l[0], corner1l[0]));
        const ys = corner0l[0] > corner1l[0] ? corner1l[1] : corner0l[1];
        const yl = corner0l[0] < corner1l[0] ? corner1l[1] : corner0l[1];
        l0xOvers[i] = [i, wgt * ys + (1 - wgt) * yl];
      }
      for (let i = Math.floor(Math.min(corner0l[1], corner1l[1]) / sideLength); i <= Math.max(corner0l[1], corner1l[1]); i += sideLength) {
        const wgt = (i - Math.min(corner0l[1], corner1l[1])) / (Math.max(corner0l[1], corner1l[1]) - Math.min(corner0l[1], corner1l[1]));
        const xs = corner0l[1] > corner1l[1] ? corner1l[0] : corner0l[0];
        const xl = corner0l[1] < corner1l[1] ? corner1l[0] : corner0l[0];
        l0yOvers[i] = [wgt * xs + (1 - wgt) * xl, i];
      }
      let l1xOvers = {};
      let l1yOvers = {};

      for (let i = Math.floor(Math.min(corner0r[0], corner1r[0]) / sideLength); i <= Math.max(corner0r[0], corner1r[0]); i += sideLength) {
        const wgt = (i - Math.min(corner0r[0], corner1r[0])) / (Math.max(corner0r[0], corner1r[0]) - Math.min(corner0r[0], corner1r[0]));
        const ys = corner0r[0] > corner1r[0] ? corner1r[1] : corner0r[1];
        const yl = corner0r[0] < corner1r[0] ? corner1r[1] : corner0r[1];
        l1xOvers[i] = [i, wgt * ys + (1 - wgt) * yl];
      }
      for (let i = Math.floor(Math.min(corner0r[1], corner1r[1]) / sideLength); i <= Math.max(corner0r[1], corner1r[1]); i += sideLength) {
        const wgt = (i - Math.min(corner0r[1], corner1r[1])) / (Math.max(corner0r[1], corner1r[1]) - Math.min(corner0r[1], corner1r[1]));
        const xs = corner0r[1] > corner1r[1] ? corner1r[0] : corner0r[0];
        const xl = corner0r[1] < corner1r[1] ? corner1r[0] : corner0r[0];
        l1yOvers[i] = [wgt * xs + (1 - wgt) * xl, i];
      }

      for (let k in Object.keys(l0xOvers)) {
        const blx = Math.round(k / sideLength);
        const bly = Math.floor(l0xOvers[k]);
        grid.setWalkableAt(blx, bly, false);
        grid.setWalkableAt(blx - 1, bly, false);
      }
      for (let k in Object.keys(l1xOvers)) {
        const blx = Math.round(k / sideLength);
        const bly = Math.floor(l0xOvers[k]);
        grid.setWalkableAt(blx, bly, false);
        grid.setWalkableAt(blx - 1, bly, false);
      }
      for (let k in Object.keys(l0yOvers)) {
        const blx = Math.floor(k / sideLength);
        const bly = Math.round(l0xOvers[k]);
        grid.setWalkableAt(blx, bly - 1, false);
        grid.setWalkableAt(blx, bly, false);
      }
      for (let k in Object.keys(l1yOvers)) {
        const blx = Math.floor(k / sideLength);
        const bly = Math.round(l0xOvers[k]);
        grid.setWalkableAt(blx, bly - 1, false);
        grid.setWalkableAt(blx, bly, false);
      }
      for (let hole in line.holes) {
        const hlobj = data.output.holes[hole];
        if (hlobj.name === "Door") {
          const hlwidth = hlobj.properties.width.length;
          let comp1 = glMatrix.vec2.create();
          let comp2 = glMatrix.vec2.create();
          let hlcenter = glMatrix.vec2.create();
          glMatrix.vec2.mul(comp1, pt0, hlobj.offset);
          glMatrix.vec2.mul(comp2, pt1, 1 - hlobj.offset);
          glMatrix.vec2.add(hlcenter, comp1, comp2);
          let cornera = glMatrix.vec2.create();
          let cornerb = glMatrix.vec2.create();
          let cornerc = glMatrix.vec2.create();
          let cornerd = glMatrix.vec2.create();
          let widthComp = glMatrix.vec2.clone(wallDir)
          glMatrix.vec2.mul(widthComp, widthComp, hlwidth / 2);
          glMatrix.vec2.add(cornera, hlcenter, widthComp);
          glMatrix.vec2.add(cornerb, hlcenter, widthComp);
          glMatrix.vec2.sub(cornerc, hlcenter, widthComp);
          glMatrix.vec2.sub(cornerd, hlcenter, widthComp);
          glMatrix.vec2.add(cornera, cornera, wallOrtho);
          glMatrix.vec2.sub(cornerb, cornerb, wallOrtho);
          glMatrix.vec2.add(cornerc, cornerc, wallOrtho);
          glMatrix.vec2.sub(cornerd, cornerd, wallOrtho);
          let minx = Math.min(cornera[0], cornerb[0], cornerc[0], cornerd[0]);
          let maxx = Math.max(cornera[0], cornerb[0], cornerc[0], cornerd[0]);
          let miny = Math.min(cornera[1], cornerb[1], cornerc[1], cornerd[1]);
          let maxy = Math.max(cornera[1], cornerb[1], cornerc[1], cornerd[1]);
          for (let x = Math.floor(minx / sideLength); x < Math.ceil(maxx / sideLength); x++) {
            for (let y = Math.floor(miny / sideLength); x < Math.ceil(maxy / sideLength); y++) {
              grid.setWalkableAt(x, y, true);
            }
          }
        }
      }
    }
  }
  return grid
}
  module.exports.airGridFromJSON = airGridFromJSON;
  module.exports.navgationGridFromJSON = navgationGridFromJSON;
