import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";
import { MESSAGES, STATES } from "global/constants/bridge";
import { searchDriver } from "../utils/eventMachines";

const { WORKSPACE_SEARCH, SEARCH_RESULT, CLEAR_SEARCH } = MESSAGES;
const { SEARCHING } = STATES;

export const searchMachine = Machine(
  {
    id: "search",
    initial: "LISTENING",
    strict: "true",
    context: {
      result: [],
    },
    states: {
      LISTENING: {
        invoke: {
          src: "setUpListeners",
          onDone: ".",
          onError: "ERROR",
        },
        on: {
          [WORKSPACE_SEARCH]: SEARCHING,
          [CLEAR_SEARCH]: {
            actions: "clearSearch",
          },
        },
      },
      [SEARCHING]: {
        entry: "sendSearch",
        on: {
          [SEARCH_RESULT]: {
            actions: "saveResult",
            target: "LISTENING",
          },
        },
      },
      ERROR: {},
    },
  },
  {
    actions: {
      sendSearch: assign((_, e) => {
        send(WORKSPACE_SEARCH, e.data);
        return {
          term: e.data,
        };
      }),
      clearSearch: assign({
        result: [],
      }),
      saveResult: assign((_, e) => ({
        result: e.data
          .split("\n")
          .filter(Boolean)
          .map(JSON.parse)
          .filter((r) => r.type === "match")
          .map((r) => r.data),
      })),
    },
    services: {
      setUpListeners: () => {
        on(SEARCH_RESULT, (_, data) => {
          searchDriver.send(SEARCH_RESULT, data);
        });
      },
    },
  }
);
