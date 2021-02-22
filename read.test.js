/* eslint-env mocha */

const assert = require("assert");
const { parse } = require("./read");

describe("parse", function() {
  it("parses correctly", function() {
    const textFromInputFile = ``;
    assert.deepEqual(parse(textFromInputFile), {});
  });
});
