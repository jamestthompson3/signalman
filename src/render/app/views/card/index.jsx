import React from "react";
import { useMachine } from "@xstate/react";

import { deleteCardDriver } from "../../utils/eventMachines";
import { Card } from "./Card.jsx";

export function CardView({ contents }) {
  React.useEffect(() => {
    if (!deleteCardDriver.isRunning()) {
      deleteCardDriver.init();
    }
    return () => deleteCardDriver.stop();
  }, []);
  const today = new Date();
  const { templates, cards } = contents;
  return (
    <div className="card-view-container">
      <h2>{today.toLocaleDateString()}</h2>
      {cards.map((card) => (
        <Card
          contents={card}
          template={templates[card.viewTemplate] || templates["basic-view"]}
          key={card.id}
        />
      ))}
    </div>
  );
}