import { ipcMain } from "electron";
import { interpret } from "xstate";

import { MESSAGES } from "../constants/bridge";
import { eventHandlerMachine } from "./eventHandler.machine";
import ipc from "../ipc";

const {
  REQUEST_WORKSPACE,
  WORKSPACE_REMOVE_CARD,
  SAVE_CARD,
  ADD_CARD,
  DELETE_CARD,
  UPDATE_CARD,
  BG_GLOBAL_UPDATE,
  WORKSPACE_SEARCH,
  WORKSPACE_LOAD_ALL,
} = MESSAGES;

const eventService = interpret(eventHandlerMachine);

eventService.onEvent((e) =>
  console.log(
    { type: e.type, data: e.data },
    "\n|==============================================|"
  )
);
// eventService.onTransition((s) => console.log(s.value));
eventService.start();

export function registerHandlers() {
  ipcMain.on(REQUEST_WORKSPACE, (event) => {
    eventService.send({
      type: REQUEST_WORKSPACE,
      event,
    });
  });
  ipcMain.on(WORKSPACE_REMOVE_CARD, (event, data) => {
    eventService.send({ type: WORKSPACE_REMOVE_CARD, data, event });
  });
  ipcMain.on(WORKSPACE_SEARCH, (event, data) => {
    eventService.send({ type: WORKSPACE_SEARCH, data, event });
  });
  ipcMain.on(SAVE_CARD, (event, data) => {
    eventService.send({ type: SAVE_CARD, data, event });
  });
  ipcMain.on(ADD_CARD, (event, data) => {
    eventService.send({ type: ADD_CARD, data, event });
  });
  ipcMain.on(DELETE_CARD, (event, data) => {
    eventService.send({ type: DELETE_CARD, data, event });
  });
  ipcMain.on(WORKSPACE_LOAD_ALL, (event, data) => {
    eventService.send({ type: WORKSPACE_LOAD_ALL, data, event });
  });
  ipcMain.on(UPDATE_CARD, async (event, data) => {
    eventService.send({
      type: UPDATE_CARD,
      data,
      event,
    });
  });
  ipcMain.on(BG_GLOBAL_UPDATE, (_, data) => {
    eventService.send({
      type: BG_GLOBAL_UPDATE,
      data,
    });
  });

  /* NODE IPC */
  registerBackgroundState();
}

function registerBackgroundState() {
  ipc.config.id = "background";
  ipc.serve(() => {
    ipc.server.on(UPDATE_CARD, () => {
      ipc.server.broadcast(UPDATE_CARD);
    });
  });
  ipc.server.start();
}
