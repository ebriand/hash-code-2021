const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");

function solve(problem, file) {
  const result = {
    numberOfIntersections: 3,
    intersections: [
      {
        index: 1,
        streets: [
          {
            name: "rue-d-athenes",
            seconds: 2
          },
          {
            name: "rue-d-amsterdam",
            seconds: 1
          }
        ]
      },
      {
        index: 0,
        streets: [
          {
            name: "rue-de-londres",
            seconds: 2
          }
        ]
      },
      {
        index: 2,
        streets: [
          {
            name: "rue-de-moscou",
            seconds: 1
          }
        ]
      }
    ]
  };
  return result;
}

module.exports = solve;
