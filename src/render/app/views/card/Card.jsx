import React from "react";
import { useMachine } from "@xstate/react";
import get from "lodash/get";

import { DayPicker } from "common/components/DayPicker.jsx";
import { cardUpdateMachine } from "machines/card-update.machine";
import { parseTimeAllotted } from "../utils/parse";

// TODO:
// expose templatting to parent component so I can execute logic on the fields
function CardField({ type, value, send, field, label }) {
  const renderOnType = (type) => {
    switch (type) {
      case "text":
        return (
          <textarea
            type="text"
            value={value}
            className="textarea-input"
            onChange={(e) => {
              send({
                type: "UPDATE_FIELD",
                data: { field, value: e.target.value },
              });
            }}
          />
        );
      case "number":
        return (
          <input
            type="text"
            className="number-input"
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => {
              const isValidNumber = !isNaN(parseInt(e.target.value));
              send({
                type: "UPDATE_FIELD",
                data: {
                  field,
                  value: isValidNumber ? parseInt(e.target.value) : undefined,
                },
              });
            }}
            value={value && parseInt(value)}
          />
        );
      case "date":
        return <DayPicker day={new Date(value)} send={send} field={field} />;
      default:
        return null;
    }
  };
  return (
    <>
      {label && <p className="field-label">{label}</p>}
      {renderOnType(type)}
    </>
  );
}

// This thing is gonna get messy
function parseTemplate({ contents, template, send }) {
  const { fields } = template;
  return (
    <div
      className="card"
      data-status={contents.status}
      data-time-allotted={parseTimeAllotted(contents.timeAllotted)}
    >
      <div className="card-meta-container">
        <div className="card-title">
          <h3 data-field="title">{contents.title}</h3>
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
            <CardField
              type={get(template, `fields.${field}.type`, "text")}
              value={get(contents, field)}
              send={send}
              field={field}
              label={get(fields, `${field}.label`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// TODO fix prop drilling
export function Card({ contents, template }) {
  const [currentState, send] = useMachine(
    cardUpdateMachine.withContext(contents)
  );
  return parseTemplate({ contents: currentState.context, template, send });
}
