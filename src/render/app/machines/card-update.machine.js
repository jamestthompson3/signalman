import { Machine, assign } from "xstate";

import { send, on } from "../utils/messagePassing.js";

export const cardUpdateMachine = Machine(
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
        },
      },
      RENDER: {},
    },
  },
  {
    actions: {
      updateField: (ctx, e) => {
        const processedData = { ...ctx, [e.data.field]: e.data.value };
        console.log({ processedData });
        send("card:update", processedData);
      },
    },
    services: {},
  }
);
