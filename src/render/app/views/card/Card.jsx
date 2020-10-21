import React from "react";
import { useMachine } from "@xstate/react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import get from "lodash/get";
import "react-day-picker/lib/style.css";

import { Editable } from "common/components/ContentEditable.jsx";
import { cardUpdateMachine } from "machines/card-update.machine";
import { STATIC_FIELDS } from "../constants";
import {
  workspaceDriver,
  deleteCardDriver,
  cardStatusDriver,
} from "../../utils/eventMachines";
import { parseTimeAllotted, parseHeight } from "../utils/parse";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD, DELETE_CARD } = MESSAGES;

// TODO:
// expose templatting to parent component so I can execute logic on the fields
function renderOnFieldType({ type, value, send, field }) {
  const formatDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };
  switch (type) {
    case "text":
      return (
        <Editable
          className="field-content"
          value={value}
          send={(data) =>
            send({ type: "UPDATE_FIELD", data: { field, value: data } })
          }
        />
      );
    case "date":
      return (
        <DayPickerInput
          value={formatDate(value)}
          onDayChange={(day) =>
            send({ type: "UPDATE_FIELD", data: { field, value: day } })
          }
          formatDate={formatDate}
          dayPickerProps={{
            selectedDays: new Date(value),
          }}
        />
      );
    default:
      return null;
  }
}

// This thing is gonna get messy
// TODO figure out editing titles
function parseTemplate({ contents, template, send }) {
  const { fields, labelFields } = template;
  return (
    <div
      className="card"
      data-status={contents.status}
      data-time-allotted={parseTimeAllotted(contents.timeAllotted)}
    >
      <div className="card-meta-container">
        <div className="card-title">
          <h4 data-field="title">{contents.title}</h4>
        </div>
        <div className="card-meta">
          <i>
            {contents.modifier === "" ? "Signalman User" : contents.modifier}
          </i>
          <small>created: {new Date(contents.created).toLocaleString()}</small>
          <small>
            modified: {new Date(contents.modified).toLocaleString()}
          </small>
          <small>
            id: <i>{contents.id}</i>
          </small>
        </div>
      </div>
      <div className="card-body">
        {Object.keys(fields).map((field) => (
          <div className="card-field" key={field}>
            {labelFields && <p>{field}: </p>}
            {renderOnFieldType({
              type: get(template, `fields.${field}.type`, "text"),
              value: get(contents, field),
              send,
              field,
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Card({ contents, template }) {
  const [currentState, send] = useMachine(
    cardUpdateMachine.withContext(contents)
  );
  return parseTemplate({ contents: currentState.context, template, send });
}
