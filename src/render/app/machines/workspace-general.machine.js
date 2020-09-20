import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";
import { MESSAGES, STATES } from "global/constants/bridge";
import { workspaceEmitter } from "../utils/emitter";

const {
  WORKSPACE_LOADED,
  REQUEST_WORKSPACE,
  RELOAD_STATE,
  WORKSPACE_REMOVE_CARD,
} = MESSAGES;
const { REMOVING_CARD } = STATES;

export const workspaceMachine = Machine(
  {
    id: "workspace-general",
    initial: "idle",
    strict: "true",
    context: {},
    states: {
      idle: {
        entry: "requestWorkspace",
        on: {
          [WORKSPACE_LOADED]: "RENDER",
        },
      },
      RENDER: {
        entry: "saveWorkspace",
        on: {
          [RELOAD_STATE]: {
            actions: "saveWorkspace",
          },
          [WORKSPACE_REMOVE_CARD]: REMOVING_CARD,
        },
      },
      [REMOVING_CARD]: {
        entry: "removeCard",
        on: {
          [RELOAD_STATE]: "RENDER",
        },
      },
    },
  },
  {
    actions: {
      saveWorkspace: assign((_, e) => e.data),
      requestWorkspace: () => {
        // register listener for RPC calls from mainIPC
        on(WORKSPACE_LOADED, (_, data) => {
          workspaceEmitter.emit(WORKSPACE_LOADED, data);
        });
        on(RELOAD_STATE, (_, data) => {
          workspaceEmitter.emit(RELOAD_STATE, data);
        });
        send(REQUEST_WORKSPACE);
      },
      removeCard: (_, e) => {
        send(WORKSPACE_REMOVE_CARD, e.data);
      },
    },
  }
);
