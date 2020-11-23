import { Machine, assign, actions } from "xstate";

import { send } from "../utils/messagePassing";
import { MESSAGES } from "global/constants/bridge";
import { workspaceEmitter } from "../utils/emitter";
import { workspaceDriver } from "../utils/eventMachines";

const { UPDATE_CARD, WORKSPACE_NAME_UPDATE, WORKSPACE_PATCH_UPDATE } = MESSAGES;

const { choose } = actions;

// Data lenses
function $processData(ctx, e) {
  if (e.data.field === "status") {
    if (e.data.value === "done") {
      return { ...ctx, [e.data.field]: e.data.value, completedAt: new Date() };
    } else {
      delete ctx.completedAt;
    }
  }
  return { ...ctx, [e.data.field]: e.data.value, changed: true };
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
            actions: choose([
              {
                cond: (ctx) => ctx.id === "settings",
                actions: ["updateField", "emitWorkspaceName"],
              },
              { actions: ["updateField"] },
            ]),
          },
          PUBLISH_UPDATE: {
            actions: "emitUpdated",
          },
          UPDATE_WORKSPACE_NAME: {
            actions: ["updateField", "emitWorkspaceName"],
          },
          UPDATE_IMMEDIATE: {
            actions: ["updateField", "emitUpdated"],
          },
        },
      },
    },
  },
  {
    actions: {
      updateField: assign($processData),
      emitUpdated: (ctx) => {
        delete ctx.changed;
        send(UPDATE_CARD, ctx);
        workspaceDriver.send(WORKSPACE_PATCH_UPDATE, ctx);
      },
      emitWorkspaceName: (ctx, e) => {
        send(UPDATE_CARD, ctx);
        workspaceEmitter.emit(WORKSPACE_NAME_UPDATE, e.data.value);
      },
    },
  }
);
