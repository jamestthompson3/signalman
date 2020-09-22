import { ipcMain } from "electron";
import { interpret } from "xstate";
import { MESSAGES } from "../constants/bridge";
import { eventHandlerMachine } from "./eventHandler.machine";

const {
  REQUEST_WORKSPACE,
  WORKSPACE_REMOVE_CARD,
  SAVE_CARD,
  UPDATE_CARD,
  BG_GLOBAL_UPDATE
} = MESSAGES;

const eventService = interpret(eventHandlerMachine);

// eventService.onEvent((e) => console.log({ type: e.type, data: e.data }));
eventService.start();

export function registerHandlers() {
  ipcMain.on(REQUEST_WORKSPACE, event => {
    eventService.send({
      type: REQUEST_WORKSPACE,
      event
    });
  });
  ipcMain.on(WORKSPACE_REMOVE_CARD, (event, data) => {
    eventService.send({ type: WORKSPACE_REMOVE_CARD, data, event });
  });
  ipcMain.on(SAVE_CARD, (event, data) => {
    eventService.send({ type: SAVE_CARD, data, event });
  });
  ipcMain.on(UPDATE_CARD, async (event, data) => {
    eventService.send({
      type: UPDATE_CARD,
      data,
      event
    });
  });
  ipcMain.on(BG_GLOBAL_UPDATE, (_, data) => {
    eventService.send({
      type: BG_GLOBAL_UPDATE,
      data
    });
  });
}
