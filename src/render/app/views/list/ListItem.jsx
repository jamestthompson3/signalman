import React from "react";
import { useMachine } from "@xstate/react";

import { Editable } from "common/components/ContentEditable.jsx";
import { Card } from "../card/Card.jsx";
import { cardUpdateMachine } from "machines/card-update.machine";
import { workspaceDriver, deleteCardDriver } from "../../utils/eventMachines";
import {
  parseTimeAllotted,
  parseHeight,
  parseDayPosition,
} from "../utils/parse";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD, DELETE_CARD } = MESSAGES;

// This thing is gonna get messy
// TODO figure out editing titles
export function ListItem({ contents, template, dayView }) {
  const [, send] = useMachine(cardUpdateMachine.withContext(contents));
  const [view, setView] = React.useState("list");

  const boxRef = React.useRef(null);
  const today = new Date();
  React.useEffect(() => {
    if (boxRef.current) {
      const d = new Date(contents.scheduled);
      if (today.getHours() === d.getHours()) {
        boxRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  }, [boxRef.current]);
  return (
    <div
      className="list-box"
      data-status={contents.status}
      ref={dayView && boxRef}
      style={dayView && { top: parseDayPosition(contents.scheduled) }}
    >
      <div style={{ display: "flex" }}>
        <button
          className="action-button"
          onClick={() => {
            workspaceDriver.send(WORKSPACE_REMOVE_CARD, contents.id);
          }}
        >
          close
        </button>
        <button
          className="action-button"
          onClick={() => setView(view === "card" ? "list" : "card")}
        >
          {view === "card" ? "view" : "edit"}
        </button>
        <button
          className="action-button"
          onClick={() =>
            send({
              type: "UPDATE_FIELD",
              data: {
                field: "status",
                value: contents.status === "done" ? "inProgress" : "done",
              },
            })
          }
        >
          {contents.status === "done" ? "mark as not done" : " mark as done"}
        </button>
        <button
          className="action-button danger"
          onClick={() => deleteCardDriver.send(DELETE_CARD, contents.id)}
        >
          delete
        </button>
      </div>
      {view === "card" ? (
        <Card contents={contents} template={template} />
      ) : (
        <div
          className="list"
          data-time-allotted={parseTimeAllotted(contents.timeAllotted)}
          style={
            dayView && {
              height: parseHeight(contents.timeAllotted),
            }
          }
        >
          <div className="list-content">
            {contents.id !== "settings" ? (
              <Editable
                className="field-content"
                value={contents.title || contents.text}
                send={(data) =>
                  send({
                    type: "UPDATE_FIELD",
                    data: {
                      field: contents.title ? "title" : "text",
                      value: data,
                    },
                  })
                }
              />
            ) : (
              <p>{contents.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
