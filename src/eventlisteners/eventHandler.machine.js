import { Machine, send } from "xstate";
import ipc from "../ipc";

import { MESSAGES, STATES } from "../constants/bridge";
import {
  workspaceRequest,
  updateGlobalState,
  workspaceSearch,
  loadAllCardsInWorkspace,
} from "./workspaces";
// TODO, maybe JIT import these??
import { saveCard, updateCard, addCard, deleteCard } from "./cards";

const {
  ADD_CARD,
  BG_GLOBAL_UPDATE,
  DELETE_CARD,
  RELOAD_STATE,
  REQUEST_WORKSPACE,
  SAVE_CARD,
  UPDATE_CARD,
  WORKSPACE_REMOVE_CARD,
  WORKSPACE_SEARCH,
  WORKSPACE_LOAD_ALL,
} = MESSAGES;

const {
  ADDING_CARD,
  BG_STATE_UPDATING,
  DELETING_CARD,
  INITIALIZING_WORKSPACE,
  REMOVING_CARD,
  SAVING_CARD,
  SEARCHING,
  UPDATING_CARD,
  LOADING_ALL_CARDS,
} = STATES;

export const eventHandlerMachine = Machine(
  {
    id: "event-handler",
    strict: "true",
    initial: "LISTENING",
    states: {
      LISTENING: {
        entry: "connectBgIPC",
        on: {
          [ADD_CARD]: ADDING_CARD,
          [BG_GLOBAL_UPDATE]: BG_STATE_UPDATING,
          [DELETE_CARD]: DELETING_CARD,
          [REQUEST_WORKSPACE]: INITIALIZING_WORKSPACE,
          [SAVE_CARD]: SAVING_CARD,
          [UPDATE_CARD]: UPDATING_CARD,
          [WORKSPACE_REMOVE_CARD]: REMOVING_CARD,
          [WORKSPACE_SEARCH]: SEARCHING,
          [WORKSPACE_LOAD_ALL]: LOADING_ALL_CARDS,
        },
      },
      [INITIALIZING_WORKSPACE]: {
        invoke: {
          src: "requestWorkspace",
          onDone: "LISTENING",
          onError: "ERROR",
        },
      },
      [SAVING_CARD]: {
        invoke: {
          src: "saveCard",
          onDone: BG_STATE_UPDATING,
          onError: "ERROR",
        },
      },
      [ADDING_CARD]: {
        invoke: {
          src: "addCard",
          onDone: BG_STATE_UPDATING,
          onError: "ERROR",
        },
      },
      [UPDATING_CARD]: {
        invoke: {
          src: "updateCard",
          onDone: "LISTENING",
          onError: "ERROR",
        },
      },
      [DELETING_CARD]: {
        invoke: {
          src: "deleteCard",
          onDone: BG_STATE_UPDATING,
          onError: "ERROR",
        },
      },
      [REMOVING_CARD]: {
        entry: "workspaceRemoveCard",
        on: {
          [BG_GLOBAL_UPDATE]: [BG_STATE_UPDATING],
        },
      },
      [BG_STATE_UPDATING]: {
        invoke: {
          src: "updateGlobalState",
          onDone: "LISTENING",
          onError: "ERROR",
        },
      },
      [SEARCHING]: {
        invoke: {
          src: "search",
          onDone: "LISTENING",
          onError: "ERROR",
        },
      },
      [LOADING_ALL_CARDS]: {
        invoke: {
          src: "loadAllCardsInWorkspace",
          onDone: "LISTENING",
          onError: "ERROR",
        },
      },
      ERROR: {
        actions: "logError",
      },
    },
  },
  {
    services: {
      requestWorkspace: (_, e) => workspaceRequest(e.event),
      loadAllCardsInWorkspace: (_, { data, event }) =>
        loadAllCardsInWorkspace({ data, event }),
      saveCard: async (_, { data, event }) => {
        const card = await saveCard(data);
        return {
          type: SAVE_CARD,
          data: card,
          event,
        };
      },
      search: (_, { data, event }) =>
        new Promise((res, rej) => {
          try {
            workspaceSearch(data, event);
            res();
          } catch (e) {
            rej(e);
          }
        }),
      addCard: async (_, { data, event }) => {
        await addCard(data);
        return {
          type: RELOAD_STATE,
          event,
        };
      },
      deleteCard: async (_, { data, event }) => {
        await deleteCard(data);
        return {
          type: WORKSPACE_REMOVE_CARD,
          event,
          data,
        };
      },
      updateCard: (_, { data }) => {
        ipc.of.background.emit(UPDATE_CARD, {
          id: ipc.config.id,
        });
        return updateCard(data);
      },
      updateGlobalState: (_, { data }) => {
        return updateGlobalState(data);
      },
    },
    actions: {
      logError: (_, e) => {
        console.error(e);
      },
      connectBgIPC: () => {
        ipc.config.id = "event-handler";
        ipc.config.retry = 1500;

        ipc.connectTo("background", () => {});
      },
      workspaceRemoveCard: send((_, { data, event }) => ({
        type: BG_GLOBAL_UPDATE,
        data: {
          type: WORKSPACE_REMOVE_CARD,
          data,
          event,
        },
      })),
    },
  }
);
