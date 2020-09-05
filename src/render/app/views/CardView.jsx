import React from "react";
import { useMachine } from "@xstate/react";
import { cardviewMachine } from "machines/cardview-general.machine.js";

import { on } from "utils/messagePassing.js";
import { Card } from "./Card.jsx";

export function CardView() {
  const [currentState, send] = useMachine(cardviewMachine);
  React.useEffect(() => {
    on("workspaceInit", (e, data) => send({ type: "CARDS_LOADED", data }));
  }, []);

  const {
    context: {
      cards: [contents, templates],
    },
  } = currentState;
  console.log({ contents });
  return contents
    ? contents.map((card) => (
        <Card
          contents={card}
          template={templates[card.viewTemplate]}
          key={card.title}
        />
      ))
    : null;
}
