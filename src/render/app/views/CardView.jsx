import React from "react";
import { useMachine } from "@xstate/react";
import { cardviewMachine } from "../machines/cardview-general.machine.js";
import { on } from "../utils/messagePassing.js";

export function CardView() {
  const [currentState, send] = useMachine(cardviewMachine);
  React.useEffect(() => {
    on("workspaceInit", (e, data) => send({ type: "CARDS_LOADED", data }));
  }, []);
  return currentState.context.cards();
}
