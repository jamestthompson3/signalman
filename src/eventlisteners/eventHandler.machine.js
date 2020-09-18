import { Machine } from "xstate";

import { MESSAGES, STATES } from "../constants/bridge";
import { workspaceRequest, updateGlobalState } from "./workspaces";
import { saveCard, updateCard } from "./cards";

const {
  REQUEST_WORKSPACE,
  SAVE_CARD,
  UPDATE_CARD,
  BG_GLOBAL_UPDATE,
  WORKSPACE_REMOVE_CARD,
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
          onDone: "LISTENING",
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
        invoke: {
          src: "workspaceRemoveCard",
          onDone: "LISTENING",
          onError: "ERROR",
        },
      },
      [BG_STATE_UPDATING]: {
        invoke: {
          src: "updateGlobalState",
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
      workspaceRemoveCard: (_, e) => workspaceRemoveCard(e.data),
      saveCard: (_, e) => saveCard(e.data),
      updateCard: (_, e) => updateCard(e.data),
      updateGlobalState: (_, e) => updateGlobalState(e.data),
    },
    actions: {
      logError: (_, e) => {
        console.error(e);
      },
    },
  }
);
