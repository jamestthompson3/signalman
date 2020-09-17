import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";

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
        on("workspace:init", (_, data) => {
          callback({ type: "WORKSPACE_LOADED", data });
        });
        send("workspace:request");
        on("bg:reloadState", (_, data) => {
          console.log("reloading...");
          callback({ type: "RELOAD", data });
        });
      },
    },
  }
);
