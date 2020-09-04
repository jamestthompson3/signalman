import { ipcMain } from "electron";
import fs from "fs";
import { getDataDir, readDataFile } from "../filesystem/utils/projectDir";

const dataDir = getDataDir();

export function registerHandlers() {
  ipcMain.on("requestWorkspace", (event, arg) => {
    fs.readFile(`${dataDir}settings.json`, "utf8", (err, data) => {
      const { displayOnStartup } = JSON.parse(data.toString());
      const startupCards = displayOnStartup.map(readDataFile);
      Promise.all(startupCards).then(cardContents => {
        console.log(cardContents);
        event.reply("workspaceInit", cardContents);
      });
    });
  });
}
