import fs from "fs";
import util from "util";

export const readFile = util.promisify(fs.readFile);
export const writeFile = util.promisify(fs.writeFile);
export const readDir = util.promisify(fs.readdir);
export const deleteFile = util.promisify(fs.unlink);

// Data dir is found in the following locations:
// Linux:   /home/alice/.local/share/signalman
// Windows: C:\Users\Alice\AppData\Roaming\signalman\data
// macOS:   /Users/Alice/Library/Application Support/signalman
export function getDataDir() {
  const path = require("path");
  const { app } = require("electron");
  let dataDir;
  switch (process.platform) {
    case "linux":
      dataDir = path.join(app.getPath("home"), ".local/share/signalman/");
      break;
    case "darwin":
      dataDir = path.join(app.getPath("userData"), "data/");
      break;
    case "win32":
      dataDir = path.join(app.getPath("userData"), "data\\");
      break;
    default:
      dataDir = app.getPath("userData");
      break;
  }
  if (process.env.NODE_ENV !== "production") {
    dataDir = `${dataDir}dev${path.sep}`;
  }
  // TODO, maybe a good usecase for different workspaces?
  return dataDir;
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
        .catch(console.error)
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

/*
 * @returns: Promise<>
 */
export function deleteDataFile(name) {
  const dataDir = getDataDir();
  const filePath = `${dataDir}${name}.json`;
  return deleteFile(filePath);
}

/*
 * Used for recursing through the data directory
 * @returns: Promise<JSONObject[]>
 */
export async function readDataDir() {
  const dataDir = getDataDir();
  const dataDirEntries = await readDir(dataDir, { withFileTypes: true });
  let parsedFiles = [];
  for (const entry of dataDirEntries) {
    if (entry.isFile()) {
      const file = await readFile(`${dataDir}${entry.name.toString()}`);
      parsedFiles.push(JSON.parse(file.toString()));
    }
  }
  return parsedFiles;
}

/*
 * Used for recursing through only task files the data directory
 * @returns: Promise<JSONObject[]>
 */
export async function readDataDirTasks() {
  const dataDir = getDataDir();
  const dataDirEntries = await readDir(dataDir, { withFileTypes: true });
  let parsedFiles = [];
  for (const entry of dataDirEntries) {
    if (entry.isFile()) {
      const file = await readFile(`${dataDir}${entry.name.toString()}`);
      const parsedFile = JSON.parse(file.toString());
      console.log(parsedFile.id);
      if (parsedFile.id !== "settings" && parsedFile.id !== "state")
        parsedFiles.push(parsedFile);
    }
  }
  return parsedFiles;
}
