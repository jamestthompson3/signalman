import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing.js";
import { MESSAGES } from "global/constants/bridge";

const { DELETE_CARD } = MESSAGES;

export const cardDeleteMachine = Machine(
  {
    id: "card-delete",
    initial: "LISTENING",
    strict: "true",
    context: {},
    states: {
      LISTENING: {
        on: {
          [DELETE_CARD]: {
            actions: "deleteCard",
          },
        },
      },
    },
  },
  {
    actions: {
      deleteCard: (_, e) => {
        send(DELETE_CARD, e.data);
      },
    },
  }
);
