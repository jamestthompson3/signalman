import { ipcMain } from "electron";
import ipc from "../ipc";
import { workspaceRequest, updateGlobalState } from "./workspaces";
import { saveCard, updateCard } from "./cards";

export function registerHandlers() {
  registerBackgroundState();
  ipcMain.on("workspace:request", workspaceRequest);
  ipcMain.on("card:save", saveCard);
  ipcMain.on("card:update", updateCard);
}

function registerBackgroundState() {
  ipc.config.id = "background";
  ipc.serve(() => {
    ipc.server.on("bg:globalUpdate", (data, socket) => {
      updateGlobalState(data);
    });
  });
  ipc.server.start();
}
