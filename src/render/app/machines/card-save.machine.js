import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing.js";

export const cardSaveMachine = Machine(
  {
    id: "card-update",
    initial: "idle",
    strict: "true",
    context: {},
    states: {
      idle: {
        on: {
          UPDATE_FIELD: {
            actions: "updateField",
          },
          SAVE_CARD: {
            actions: "saveCard",
          },
        },
      },
      RENDER: {},
    },
  },
  {
    actions: {
      updateField: assign((ctx, e) => ({
        ...ctx,
        [e.data.field]: e.data.value,
      })),
      saveCard: (ctx) => {
        send("card:save", ctx);
      },
    },
    services: {},
  }
);
