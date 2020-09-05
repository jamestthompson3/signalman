import React from "react";
import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing.js";

export const cardviewMachine = Machine(
  {
    id: "cardview-general",
    initial: "idle",
    strict: "true",
    context: {
      cards: []
    },
    states: {
      idle: {
        entry: "requestCards",
        on: {
          CARDS_LOADED: "RENDER"
        }
      },
      RENDER: {
        entry: "saveCards"
      }
    }
  },
  {
    actions: {
      requestCards: () => send("requestWorkspace"),
      saveCards: assign({
        cards: (_, e) => e.data
      })
    }
  }
);
