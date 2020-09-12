import { ipcMain } from "electron";
import { workspaceRequest } from "./workspaces";
import { saveCard, updateCard } from "./cards";

export function registerHandlers() {
  ipcMain.on("workspace:request", workspaceRequest);
  ipcMain.on("card:save", saveCard);
  ipcMain.on("card:update", updateCard);
}
