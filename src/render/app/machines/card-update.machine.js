import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing";
import { MESSAGES } from "global/constants/bridge";
import { workspaceEmitter } from "../utils/emitter";

const { UPDATE_CARD, WORKSPACE_NAME_UPDATE } = MESSAGES;

export const cardUpdateMachine = Machine(
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
        },
      },
    },
  },
  {
    actions: {
      updateField: assign((ctx, e) => {
        const processedData = { ...ctx, [e.data.field]: e.data.value };
        // TODO if calls start to choke I/O, maybe enqueue updates and process them on a timer loop?
        send(UPDATE_CARD, processedData);
        if (e.data.field === "name") {
          workspaceEmitter.emit(WORKSPACE_NAME_UPDATE, e.data.value);
        }
        return processedData;
      }),
    },
  }
);
