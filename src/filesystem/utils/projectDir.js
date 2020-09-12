// Data dir is found in the following locations:
// Linux:   /home/alice/.local/share/signalman
// Windows: C:\Users\Alice\AppData\Roaming\emojipicker\data
// macOS:   /Users/Alice/Library/Application Support/signalman
import path from "path";
import fs from "fs";
import util from "util";
import { app } from "electron";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export function getDataDir() {
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
 * @returns: Promise<JSONObject>
 */
export function readTemplateFile(name) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}/templates/${name}.json`;
  return readFile(filePath, "utf8")
    .then((data) => data.toString())
    .then(JSON.parse)
    .catch(console.error);
}

/*
 * @returns: Promise<>
 */
export function writeDataFile(name, data) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return writeFile(filePath, JSON.stringify(data));
}
