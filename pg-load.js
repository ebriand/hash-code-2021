const _ = require("lodash");
const debug = require("debug")("pg-load");
const { Client } = require("pg");

const insertDataSet = async (client, dataSet, dataSetName) => {
  // insert the data set in the db here
};

const main = async files => {
  if (files.length === 0) {
    debug("no input files");
    return;
  }

  const dataSets = _(files)
    .keyBy(file => file.split(".")[0].replace("-", "_"))
    .mapValues(file => require(`./${file}`))
    .value();

  const client = new Client({
    connectionString: "postgres://postgres@localhost:5432/postgres"
  });

  await client.connect();

  await Promise.all(
    Object.entries(dataSets).map(async ([dataSetName, dataSet]) => {
      const database = dataSetName;
      await client.query(`drop database if exists ${database}`);
      await client.query(`create database ${database}`);
      debug(dataSetName, "database created");
      const dataSetClient = new Client({
        connectionString: `postgres://postgres@localhost:5432/${database}`
      });
      await dataSetClient.connect();
      await dataSetClient.query("begin");
      try {
        await insertDataSet(client, dataSet, dataSetName);
        await dataSetClient.query("commit");
        debug(dataSetName, "dataset committed");
      } catch (err) {
        await dataSetClient.query("rollback");
        debug(dataSetName, "rolled back", err);
      }
      await dataSetClient.end();
    })
  );

  await client.end();
};

main(process.argv.slice(2));
