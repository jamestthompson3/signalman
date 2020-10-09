import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing";
import { MESSAGES } from "global/constants/bridge";
import { workspaceEmitter } from "../utils/emitter";

const { UPDATE_CARD, WORKSPACE_NAME_UPDATE } = MESSAGES;

function processData(ctx, e) {
  if (e.data.field === "status") {
    if (e.data.value === "done") {
      return { ...ctx, [e.data.field]: e.data.value, completedAt: new Date() };
    } else {
      delete ctx.completedAt;
    }
  }
  return { ...ctx, [e.data.field]: e.data.value };
}

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
        const processedData = processData(ctx, e);
        send(UPDATE_CARD, processedData);
        if (e.data.field === "name") {
          workspaceEmitter.emit(WORKSPACE_NAME_UPDATE, e.data.value);
        }
        return processedData;
      }),
    },
  }
);
