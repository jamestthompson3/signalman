import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";
import { MESSAGES } from "global/constants/bridge";
import { workspaceEmitter } from "../utils/emitter";

const { SAVE_CARD, RELOAD_STATE } = MESSAGES;

export const cardSaveMachine = Machine(
  {
    id: "card-update",
    initial: "LISTENING",
    strict: "true",
    context: {},
    states: {
      LISTENING: {
        on: {
          UPDATE_FIELD: {
            actions: "updateField",
          },
          SAVE_CARD: {
            actions: "saveCard",
          },
        },
      },
    },
  },
  {
    actions: {
      updateField: assign((ctx, e) => ({
        ...ctx,
        [e.data.field]: e.data.value,
      })),
      saveCard: (ctx) => {
        send(SAVE_CARD, ctx);
      },
    },
  }
);
