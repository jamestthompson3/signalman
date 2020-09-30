import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const deleteFile = util.promisify(fs.unlink);

// Data dir is found in the following locations:
// Linux:   /home/alice/.local/share/signalman
// Windows: C:\Users\Alice\AppData\Roaming\emojipicker\data
// macOS:   /Users/Alice/Library/Application Support/signalman
export function getDataDir() {
  const path = require("path");
  const { app } = require("electron");
  switch (process.platform) {
    case "linux":
      return path.join(app.getPath("home"), ".local/share/signalman/");
    case "darwin":
      return app.getPath("userData");
    case "win32":
      return path.join(app.getPath("userData"), "data\\");
    default:
      return app.getPath("userData");
  }
}

/*
 * @returns: Promise<JSONObject>
 */
export function readDataFile(name) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return readFile(filePath, "utf8")
    .then((data) => data.toString())
    .then(JSON.parse)
    .catch(console.error);
}

/*
 * @returns: Promise<JSONObject>[]
 */
export async function readTemplateFiles() {
  const path = `${getDataDir()}templates/`;
  const files = await readDir(path);
  return Promise.allSettled(
    files.map((filePath) =>
      readFile(path + filePath, "utf8")
        .then((data) => data.toString())
        .then(JSON.parse)
        .catch(console.errror)
    )
  ).catch(console.error);
}

/*
 * @returns: Promise<>
 */
export function writeDataFile(name, data) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return writeFile(filePath, JSON.stringify(data));
}

export function deleteDataFile(name) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return deleteFile(filePath);
}
