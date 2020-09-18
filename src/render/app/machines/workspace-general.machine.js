import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";
import { MESSAGES, STATES } from "global/constants/bridge";

const {
  WORKSPACE_LOADED,
  REQUEST_WORKSPACE,
  RELOAD_STATE,
  REMOVE_SUCCESS,
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
        invoke: {
          id: "workspaceRequest",
          src: "requestWorkspace",
          onDone: ".",
          onError: ".",
        },
        on: {
          [WORKSPACE_LOADED]: "RENDER",
        },
      },
      RENDER: {
        entry: "saveWorkspace",
        on: {
          RELOAD: ".",
          REMOVE_CARD: REMOVING_CARD,
        },
      },
      [REMOVING_CARD]: {
        invoke: {
          id: REMOVING_CARD,
          src: "removeCard",
          onDone: ".",
          onError: "idle",
        },
        on: {
          RELOAD: "RENDER",
        },
      },
    },
  },
  {
    actions: {
      saveWorkspace: assign((_, e) => e.data),
    },
    services: {
      requestWorkspace: () => (callback) => {
        // register listener for RPC calls from mainIPC
        on(WORKSPACE_LOADED, (_, data) => {
          callback({ type: WORKSPACE_LOADED, data });
        });
        send(REQUEST_WORKSPACE);
        on(RELOAD_STATE, (_, data) => {
          console.log("reloading...");
          callback({ type: "RELOAD", data });
        });
      },
      removeCard: (ctx, e) => (callback) => {
        on(REMOVE_SUCCESS, () => {
          callback({
            type: "RELOAD",
            data: {
              ...ctx,
              shown: ctx.shown.filter((card) => card.id !== e.data),
            },
          });
        });
        send(REQUEST_WORKSPACE, e.data);
      },
    },
  }
);
