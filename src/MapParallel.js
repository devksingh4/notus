const wpool = require("workerpool")

const MapParallel = (func, data) => {
    var wp = wpool.pool();
    var promises = data.map(x => wp.exec(func, [x]))
    var allPromises = Promise.all(promises)
    return allPromises.then((val) => {
      wp.terminate();
      return val;
    })
}

module.exports = MapParallel;