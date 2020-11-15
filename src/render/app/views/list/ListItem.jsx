import React from "react";
import { useMachine } from "@xstate/react";

import { Card } from "../card/Card.jsx";
import { cardUpdateMachine } from "machines/card-update.machine";
import { workspaceDriver, deleteCardDriver } from "../../utils/eventMachines";
import {
  parseTimeAllotted,
  parseHeight,
  parseDayPosition,
  BASE_TIME_TICK,
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
      id={contents.id}
      style={dayView && { top: parseDayPosition(contents.scheduled) }}
    >
      <div className="action-button-container">
        <button
          data-buttonaction={dayView && "hide"}
          className="action-button"
          onClick={() => {
            workspaceDriver.send(WORKSPACE_REMOVE_CARD, contents.id);
          }}
        >
          🙈
        </button>
        <button
          className="action-button"
          onClick={() => setView(view === "card" ? "list" : "card")}
        >
          {view === "card" ? "👓" : "📝"}
        </button>
        {contents.id !== "settings" && (
          <>
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
              {contents.status === "done" ? "⭕" : "✔️"}
            </button>
            <button
              className="action-button danger"
              onClick={() => deleteCardDriver.send(DELETE_CARD, contents.id)}
            >
              🗑️
            </button>
          </>
        )}
      </div>
      {view === "card" ? (
        <Card contents={contents} template={template} />
      ) : (
        <div
          className="list"
          data-time-allotted={parseTimeAllotted(contents.timeAllotted)}
          style={
            dayView && {
              height: parseHeight(contents.timeAllotted || BASE_TIME_TICK),
            }
          }
        >
          <div>
            <div className="title-container">
              {contents.id !== "settings" ? (
                <input
                  type="text"
                  className="as-title"
                  value={contents.title || contents.id}
                  onChange={(e) => {
                    send({
                      type: "UPDATE_FIELD",
                      data: {
                        field: "title",
                        value: e.target.value,
                      },
                    });
                  }}
                />
              ) : (
                <h3>{contents.title}</h3>
              )}
              {contents.scheduled && (
                <div className="time-label">
                  <p>⏰</p>
                  <time
                    className="date-scheduled"
                    dateTime={contents.scheduled}
                  >
                    {new Date(contents.scheduled).toLocaleDateString()}
                  </time>
                </div>
              )}
            </div>
            {Boolean(contents.text) && (
              <textarea
                className="as-text"
                value={contents.text}
                onChange={(e) => {
                  send({
                    type: "UPDATE_FIELD",
                    data: {
                      field: "text",
                      value: e.target.value,
                    },
                  });
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
