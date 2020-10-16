import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing";
import { MESSAGES } from "global/constants/bridge";
import { workspaceEmitter } from "../utils/emitter";
import { workspaceDriver } from "../utils/eventMachines";

const { UPDATE_CARD, WORKSPACE_NAME_UPDATE, WORKSPACE_PATCH_UPDATE } = MESSAGES;

// Data lenses
function $processData(ctx, e) {
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
            actions: ["updateField", "emitUpdated"],
          },
        },
      },
    },
  },
  {
    actions: {
      updateField: assign($processData),
      emitUpdated: (ctx, e) => {
        send(UPDATE_CARD, ctx);
        if (e.data.field === "name") {
          workspaceEmitter.emit(WORKSPACE_NAME_UPDATE, e.data.value);
        } else {
          workspaceDriver.send(WORKSPACE_PATCH_UPDATE, ctx);
        }
      },
    },
  }
);
