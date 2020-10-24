import React from "react";

import { deleteCardDriver } from "../../utils/eventMachines";
import { ListItem } from "../list/ListItem.jsx";
import "./card.css";

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
      <div className="card-container">
        {cards.map((card) => (
          <ListItem
            contents={card}
            template={templates[card.viewTemplate] || templates["basic-view"]}
            key={card.id}
            dayView
          />
        ))}
      </div>
    </div>
  );
}
