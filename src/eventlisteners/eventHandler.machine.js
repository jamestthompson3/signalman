import { Machine, send } from "xstate";

import { MESSAGES, STATES } from "../constants/bridge";
import {
  workspaceRequest,
  updateGlobalState,
  workspaceSearch,
} from "./workspaces";
import { saveCard, updateCard } from "./cards";

const {
  REQUEST_WORKSPACE,
  SAVE_CARD,
  UPDATE_CARD,
  BG_GLOBAL_UPDATE,
  RELOAD_STATE,
  WORKSPACE_REMOVE_CARD,
  WORKSPACE_SEARCHING,
} = MESSAGES;

const {
  INITIALIZING_WORKSPACE,
  SAVING_CARD,
  UPDATING_CARD,
  BG_STATE_UPDATING,
  REMOVING_CARD,
} = STATES;

export const eventHandlerMachine = Machine(
  {
    id: "event-handler",
    strict: "true",
    initial: "LISTENING",
    states: {
      LISTENING: {
        on: {
          [REQUEST_WORKSPACE]: INITIALIZING_WORKSPACE,
          [SAVE_CARD]: SAVING_CARD,
          [UPDATE_CARD]: UPDATING_CARD,
          [BG_GLOBAL_UPDATE]: BG_STATE_UPDATING,
          [WORKSPACE_REMOVE_CARD]: REMOVING_CARD,
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
      [UPDATING_CARD]: {
        invoke: {
          src: "updateCard",
          onDone: "LISTENING",
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
      [WORKSPACE_SEARCHING]: {
        entry: "search",
        // TODO go back to LISTENING state
      },
      ERROR: {
        actions: "logError",
      },
    },
  },
  {
    services: {
      requestWorkspace: (_, e) => workspaceRequest(e.event),
      saveCard: async (_, { data, event }) => {
        const card = await saveCard(data);
        return {
          type: SAVE_CARD,
          data: card,
          event,
        };
      },
      updateCard: (_, { data }) => updateCard(data),
      updateGlobalState: (_, { data }) => updateGlobalState(data),
    },
    actions: {
      logError: (_, e) => {
        console.error(e);
      },
      search: (_, { data, event }) => workspaceSearch(data, event),
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
