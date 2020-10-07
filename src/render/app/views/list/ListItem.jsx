import React from "react";
import { useMachine } from "@xstate/react";

import { Editable } from "common/components/ContentEditable.jsx";
import { Card } from "../card/Card.jsx";
import { cardUpdateMachine } from "machines/card-update.machine";
import { workspaceDriver } from "../../utils/eventMachines";
import { parseTimeAllotted } from "../utils/parse";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD } = MESSAGES;

// This thing is gonna get messy
// FIXME I don't like prop-drilling the send function.
// TODO figure out editing titles
function parseTemplate({ contents, template, send }) {
  const [view, setView] = React.useState("list");
  return view === "card" ? (
    <Card contents={contents} template={template} />
  ) : (
    <div
      className="list"
      data-time-allotted={parseTimeAllotted(contents.timeAllotted)}
    >
      <div className="list-content">
        {contents.id !== "settings" ? (
          <Editable
            className="field-content"
            value={contents.title || contents.text}
            send={data =>
              send({
                type: "UPDATE_FIELD",
                data: { field: contents.title ? "title" : "text", value: data }
              })
            }
          />
        ) : (
          <p>{contents.title}</p>
        )}
        <div style={{ display: "flex" }}>
          <button
            className="action-button"
            onClick={() => {
              workspaceDriver.send(WORKSPACE_REMOVE_CARD, contents.id);
            }}
          >
            close
          </button>
          <button className="action-button" onClick={() => setView("card")}>
            edit
          </button>
        </div>
      </div>
    </div>
  );
}

export function ListItem({ contents, template }) {
  const [, send] = useMachine(cardUpdateMachine.withContext(contents));
  return parseTemplate({ contents, template, send });
}
