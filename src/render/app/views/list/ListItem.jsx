import React from "react";
import { useMachine } from "@xstate/react";

import { Editable } from "common/components/ContentEditable.jsx";
import { cardUpdateMachine } from "machines/card-update.machine";
import { STATIC_FIELDS } from "../constants";
import { workspaceDriver, deleteCardDriver } from "../../utils/eventMachines";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD, DELETE_CARD } = MESSAGES;

// This thing is gonna get messy
// FIXME I don't like prop-drilling the send function.
// TODO figure out editing titles
function parseTemplate({ contents, template, send }) {
  const { displayFields, labelFields } = template;
  return (
    <div className="list">
      <div className="list-content">
        <Editable
          className="field-content"
          value={contents.title || contents.text}
          send={(data) =>
            send({
              type: "UPDATE_FIELD",
              data: { field: contents.title ? "title" : "text", value: data },
            })
          }
        />
        <div style={{ display: "flex" }}>
          <button
            className="action-button"
            onClick={() => {
              workspaceDriver.send(WORKSPACE_REMOVE_CARD, contents.id);
            }}
          >
            close
          </button>
          {contents.id !== "settings" && (
            <button
              className="action-button danger"
              onClick={() => deleteCardDriver.send(DELETE_CARD, contents.id)}
            >
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ListItem({ contents, template }) {
  const [, send] = useMachine(cardUpdateMachine.withContext(contents));
  return parseTemplate({ contents, template, send });
}
