import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";
import { MESSAGES, STATES } from "global/constants/bridge";
import { workspaceDriver } from "../utils/eventMachines";

const {
  WORKSPACE_LOADED,
  REQUEST_WORKSPACE,
  RELOAD_STATE,
  ADD_CARD,
  WORKSPACE_REMOVE_CARD,
} = MESSAGES;
const { REMOVING_CARD, ADDING_CARD } = STATES;

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
          [ADD_CARD]: ADDING_CARD,
        },
      },
      [REMOVING_CARD]: {
        entry: "removeCard",
        on: {
          [RELOAD_STATE]: "RENDER",
        },
      },
      [ADDING_CARD]: {
        entry: "addCard",
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
          workspaceDriver.send(WORKSPACE_LOADED, data);
        });
        on(RELOAD_STATE, (_, data) => {
          workspaceDriver.send(RELOAD_STATE, data);
        });
        send(REQUEST_WORKSPACE);
      },
      removeCard: (_, e) => {
        send(WORKSPACE_REMOVE_CARD, e.data);
      },
      addCard: (ctx, e) => {
        if (e.data && !ctx.shown[0].find((card) => card.id === e.data)) {
          send(ADD_CARD, e.data);
        }
      },
    },
  }
);
