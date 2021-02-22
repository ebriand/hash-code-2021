const _ = require("lodash");
const debug = require("debug")("download");
const fs = require("fs");
const path = require("path");
const request = require("request");
const requestPromise = require("request-promise");
const exec = require("child_process").execSync;
const packageJson = require("./package.json");

const downloadDir =
  process.env.DOWNLOAD_DIR || process.env.npm_package_config_downloadDir || "";
const authToken = exec("sh gcloud-auth-token.sh")
  .toString()
  .trimRight();
// old method with the env var
// const authToken = process.env.HASH_CODE_JUDGE_AUTH_TOKEN;
// if (!authToken) {
//   console.error(
//     "HASH_CODE_JUDGE_AUTH_TOKEN not defined. Set it with your auth token to the Judge system."
//   );
//   process.exit();
// }
const authHeader = { Authorization: `Bearer ${authToken}` };

const downloadBlob = blobKey => {
  const uri = `https://hashcodejudge.withgoogle.com/download/${blobKey}`;
  return request({ uri, headers: authHeader });
};

const downloadRoundsInfo = async () => {
  const uri = "https://hashcode-judge.appspot.com/api/judge/v1/rounds";
  const roundsInfo = await requestPromise({
    uri,
    json: true,
    headers: authHeader
  });
  return roundsInfo;
};

const downloadProblemStatement = round => {
  return downloadBlob(round.problemBlobKey);
};

const downloadInputs = round => {
  return round.dataSets.map(({ id, name, inputBlobKey }) => ({
    id,
    name,
    stream: downloadBlob(inputBlobKey)
  }));
};

const download = async () => {
  const roundsInfo = await downloadRoundsInfo();
  const activeRound = roundsInfo.items.filter(round => round.active)[0];
  const activeDataSets = activeRound.dataSets.map(({ id, name }, i) => ({
    id,
    name: _.kebabCase(name),
    ordinalName: `input${i + 1}`,
    scriptName: `input:${i + 1}`
  }));
  packageJson.config = activeDataSets.reduce(
    (config, { id, name, ordinalName }) => ({
      ...config,
      [ordinalName]: { id, name }
    }),
    packageJson.config
  );
  packageJson.scripts = activeDataSets.reduce(
    (scripts, { name, scriptName }) => ({
      ...scripts,
      [scriptName]: `cross-env npm start ${name}.in.txt`
    }),
    packageJson.scripts
  );
  delete packageJson.scripts["input:none"];
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
  debug(`written 'package.json'`);
  const roundFile = "round.json";
  fs.writeFileSync(roundFile, JSON.stringify(activeRound, null, 2));
  debug(`written '${roundFile}'`);
  const statementFile = path.join(downloadDir, "statement.pdf");
  downloadProblemStatement(activeRound)
    .pipe(fs.createWriteStream(statementFile))
    .on("error", err => debug(`error while writing '${statementFile}'`, err))
    .on("close", () => debug(`written '${statementFile}'`));
  downloadInputs(activeRound).forEach(({ name, stream }) => {
    const sanitizedName = _.kebabCase(name);
    const inputFile = path.join(downloadDir, `${sanitizedName}.in.txt`);
    stream
      .pipe(fs.createWriteStream(inputFile))
      .on("error", err => debug(`error while writing '${inputFile}'`, err))
      .on("close", () => debug(`written '${inputFile}'`));
    const outputFile = path.join(downloadDir, `${sanitizedName}.out.txt`);
    fs.writeFile(outputFile, "", { flag: "wx" }, err => {
      if (err && err.code === "EEXIST") {
        debug(`did not overwrite '${outputFile}'`);
      } else if (err) {
        debug(`error while writing '${outputFile}'`, err);
      } else {
        debug(`written '${outputFile}'`);
      }
    });
  });
};

if (module === require.main) {
  download();
}
