import { app, BrowserWindow } from "electron";
import * as shortcut from "electron-squirrel-startup";

import { bootstrap } from "./filesystem/utils/createInitialFiles";
import { registerHandlers } from "./eventlisteners";
import { spawnDateWatcher } from "./services";

const isDev = process.env.NODE_ENV !== "production";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (shortcut) {
  // eslint-disable-line global-require
  app.quit();
}

bootstrap();
registerHandlers();

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 900,
    backgroundColor: "#091818ff",
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  });
  isDev && mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow && mainWindow.focus();
    setImmediate(() => {
      mainWindow && mainWindow.focus();
    });
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.on("did-finish-load", () =>
    spawnDateWatcher(mainWindow.webContents)
  );
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
