import { ipcMain } from "electron";
import { handleWorkspaceRequest } from "./workspaces";

export function registerHandlers() {
  ipcMain.on("requestWorkspace", handleWorkspaceRequest);
}
