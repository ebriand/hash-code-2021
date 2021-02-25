const _ = require("lodash/fp");
const fs = require("fs");
const { intersection } = require("lodash");
const debug = require("debug")("write");

module.exports = function write(path, solution) {
  writeLines(path, unparse(solution));
};

function writeLines(path, lines) {
  fs.writeFileSync(path, lines.join("\n"));
  debug(`wrote ${lines.length} lines to ${path}`);
}

const unparse = solution => {
  const result = [];
  result.push(solution.numberOfIntersections);
  for (let intersection of solution.intersections) {
    result.push(intersection.index);
    result.push(intersection.streets.length);
    for (let street of intersection.streets) {
      result.push(street.name + " " + street.seconds);
    }
  }
  return result;
};

module.exports.unparse = unparse;
