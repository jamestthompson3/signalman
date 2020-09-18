import { ipcMain } from "electron";
import { interpret } from "xstate";
import { MESSAGES } from "../constants/bridge";
import { eventHandlerMachine } from "./eventHandler.machine";

const eventService = interpret(eventHandlerMachine);

// eventService.onTransition(console.log);
eventService.start();

export function registerHandlers() {
  ipcMain.on(MESSAGES.REQUEST_WORKSPACE, (e) => {
    eventService.send({
      type: MESSAGES.REQUEST_WORKSPACE,
      event: e,
    });
  });
  ipcMain.on(MESSAGES.SAVE_CARD, (_, data) => {
    eventService.send({ type: MESSAGES.SAVE_CARD, data });
  });
  ipcMain.on(MESSAGES.UPDATE_CARD, async (_, data) => {
    eventService.send({
      type: MESSAGES.UPDATE_CARD,
      data,
    });
  });
  ipcMain.on(MESSAGES.BG_GLOBAL_UPDATE, (_, data) => {
    eventService.send({
      type: MESSAGES.BG_GLOBAL_UPDATE,
      data,
    });
  });
}
