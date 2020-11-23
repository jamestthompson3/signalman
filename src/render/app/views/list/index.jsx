import React from "react";
import { MESSAGES } from "global/constants/bridge";

import { deleteCardDriver, workspaceDriver } from "../../utils/eventMachines";
import { ListItem } from "./ListItem.jsx";
import "./list.css";

const { WORKSPACE_LOAD_ALL } = MESSAGES;

export function ListView({ contents }) {
  React.useEffect(() => {
    if (!deleteCardDriver.isRunning()) {
      deleteCardDriver.init();
    }
    return () => deleteCardDriver.stop();
  }, []);
  const { templates, cards } = contents;
  return (
    <>
      <div className="workspace-action-container">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            workspaceDriver.send(WORKSPACE_LOAD_ALL);
          }}
        >
          Display all
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            workspaceDriver.send(WORKSPACE_LOAD_ALL, true);
          }}
        >
          Display unfinished
        </button>
      </div>
      <div className="list-container">
        {cards.map((card) => (
          <ListItem
            contents={card}
            template={templates[card.viewTemplate] || templates["basic-view"]}
            key={card.id}
          />
        ))}
      </div>
    </>
  );
}
