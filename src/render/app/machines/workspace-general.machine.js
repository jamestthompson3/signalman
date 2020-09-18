import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_LOADED, REQUEST_WORKSPACE, RELOAD_STATE } = MESSAGES;

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
          WORKSPACE_LOADED: "RENDER",
        },
      },
      RENDER: {
        entry: "saveWorkspace",
        on: {
          RELOAD: ".",
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
          callback({ type: "WORKSPACE_LOADED", data });
        });
        send(REQUEST_WORKSPACE);
        on(RELOAD_STATE, (_, data) => {
          console.log("reloading...");
          callback({ type: "RELOAD", data });
        });
      },
    },
  }
);
