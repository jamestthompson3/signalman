import React from "react";
import { useMachine } from "@xstate/react";
import { cardviewMachine } from "machines/cardview-general.machine.js";
import { on } from "utils/messagePassing.js";

export function CardView() {
  const [currentState, send] = useMachine(cardviewMachine);
  React.useEffect(() => {
    on("workspaceInit", (e, data) => send({ type: "CARDS_LOADED", data }));
  }, []);

  const { context } = currentState;
  return context.cards.map(card => (
    <div className="card" key={card.title}>
      <h2 data-field="title" className="card-title">
        {card.title}
      </h2>
      <p>{card.text}</p>
    </div>
  ));
}
