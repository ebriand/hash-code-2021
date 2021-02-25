const debug = require("debug")("solve");
const _ = require("lodash");
const gridUtils = require("./grid-utils");

function solve({ parsedValue: { simulationSeconds, streets, cars } }, file) {
  sortCarsByNumberOfStreets(cars);
  const streetsWithCars = getStreetsWithCars(streets, cars);
  const intersections = getIntersections(streetsWithCars);
  const streetLength = streets.reduce((map, street) => {
    map[street.name] = street.duration;
    return map;
  }, {});
  const streetsByJam = countCarIntersections(
    cars.slice(0, Math.ceil((cars.length * 40) / 100))
  );

  const distance = calcCarDistance(cars, streetLength);

  //debug(distance);

  const result = {
    numberOfIntersections: Object.keys(intersections).length,
    intersections: Object.entries(intersections).map(([index, streets]) => ({
      index,
      streets: streets.streets.map(({ name }) => ({
        name,
        seconds: Math.min(
          Math.max(
            1,
            distance.get(name).reduce((a, b) => b - a)
          ),
          simulationSeconds - 1
        )
      }))
    }))
  };
  return result;
}

function sortCarsByNumberOfStreets(cars) {
  cars.sort((c1, c2) => c1.path.length - c2.path.length);
}

function getStreetsWithCars(streets, cars) {
  const streetsWithCars = streets.filter(street =>
    cars.some(car => car.path.includes(street.name))
  );
  return streetsWithCars;
}

function countCarIntersections(cars) {
  let streets = new Map();
  cars.forEach(car => {
    car.path.forEach(rue => {
      streets.set(rue, (streets.get(rue) || 0) + 1);
    });
  });
  return streets;
}

function calcCarDistance(cars, streetLength) {
  let streets = new Map();
  cars.forEach(car => {
    let time = 0;
    car.path.forEach(rue => {
      if (!streets.has(rue)) streets.set(rue, []);
      streets.get(rue).push(time);
      time += streetLength[rue] + 1;
    });
  });
  streets.forEach(value => value.sort((a, b) => b - a));
  return streets;
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
