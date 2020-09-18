import { ipcMain } from "electron";
import { interpret } from "xstate";
import { MESSAGES } from "../constants/bridge";
import { eventHandlerMachine } from "./eventHandler.machine";

const {
  REQUEST_WORKSPACE,
  WORKSPACE_REMOVE_CARD,
  SAVE_CARD,
  UPDATE_CARD,
  BG_GLOBAL_UPDATE,
} = MESSAGES;

const eventService = interpret(eventHandlerMachine);

// eventService.onTransition(console.log);
eventService.start();

export function registerHandlers() {
  ipcMain.on(REQUEST_WORKSPACE, (e) => {
    eventService.send({
      type: REQUEST_WORKSPACE,
      event: e,
    });
  });
  ipcMain.on(WORKSPACE_REMOVE_CARD, (_, data) => {
    eventService.send({ type: WORKSPACE_REMOVE_CARD, data });
  });
  ipcMain.on(SAVE_CARD, (_, data) => {
    eventService.send({ type: MESSAGES.SAVE_CARD, data });
  });
  ipcMain.on(UPDATE_CARD, async (_, data) => {
    eventService.send({
      type: UPDATE_CARD,
      data,
    });
  });
  ipcMain.on(BG_GLOBAL_UPDATE, (_, data) => {
    eventService.send({
      type: BG_GLOBAL_UPDATE,
      data,
    });
  });
}
