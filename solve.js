const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");

function solve({ parsedValue }, file) {
  const streetsWithCars = getStreetsWithCars(
    parsedValue.streets,
    parsedValue.cars
  );
  const intersections = getIntersections(streetsWithCars);

  const result = {
    numberOfIntersections: Object.keys(intersections).length,
    intersections: Object.entries(intersections).map(([index, streets]) => ({
      index,
      streets: streets.streets.map(({ name }) => ({ name, seconds: 1 }))
    }))
  };
  return result;
}

function getStreetsWithCars(streets, cars) {
  const streetsWithCars = streets.filter(street =>
    cars.some(car => car.path.includes(street.name))
  );
  debug(streets.length, streetsWithCars.length);
  return streetsWithCars;
}

function getIntersections(streets) {
  // {
  //   "index": 0,
  //   "intersectionStart": 2,
  //   "intersectionEnd": 0,
  //   "name": "rue-de-londres",
  //   "duration": 1
  // },
  const intersections = {};
  streets.forEach(street => {
    if (!intersections[street.intersectionEnd]) {
      intersections[street.intersectionEnd] = {
        streets: [street]
      };
    } else {
      intersections[street.intersectionEnd].streets.push(street);
    }
  });
  return intersections;
}

module.exports = solve;
