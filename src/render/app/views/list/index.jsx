import React from "react";

import { deleteCardDriver } from "../../utils/eventMachines";
import { ListItem } from "./ListItem.jsx";

export function ListView({ contents }) {
  React.useEffect(() => {
    if (!deleteCardDriver.isRunning()) {
      deleteCardDriver.init();
    }
    return () => deleteCardDriver.stop();
  }, []);
  const { templates, cards } = contents;
  return (
    <div className="list-container">
      {cards.map((card) => (
        <ListItem
          contents={card}
          template={templates[card.viewTemplate] || templates["basic-view"]}
          key={card.id}
        />
      ))}
    </div>
  );
}
