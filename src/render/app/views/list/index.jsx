import React from "react";
import { useMachine } from "@xstate/react";

import { cardSaveMachine } from "machines/card-save.machine";
import { deleteCardDriver } from "../../utils/eventMachines";
import { ListItem } from "./ListItem.jsx";

export function ListView({ contents }) {
  const [showDialog, setShowDialog] = React.useState(false);
  React.useEffect(() => {
    if (!deleteCardDriver.isRunning()) {
      deleteCardDriver.init();
    }
    return () => deleteCardDriver.stop();
  }, []);
  const templates = contents[1];
  const shown = contents[0];
  return (
    <div className="list-container">
      {shown.map((card) => (
        <ListItem
          contents={card}
          template={templates[card.viewTemplate] || templates["basic-view"]}
          key={card.id}
        />
      ))}
    </div>
  );
}
