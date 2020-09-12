import React from "react";
import { Editable } from "common/components/ContentEditable.jsx";
import { useMachine } from "@xstate/react";
import { cardUpdateMachine } from "machines/card-update.machine";

const STATIC_FIELDS = ["created", "modified", "modifier", "title", "id"];

// TODO:
// expose templatting to parent component so I can execute logic on the fields
// Drag and drop all the things!!
// very naive first pass
function parseTemplateFields(displayFields, labelFields, contents, send) {
  const renderFields = (fields) =>
    fields.map((field) => (
      <div className="card-field" key={field}>
        {labelFields && <p>{field}: </p>}
        <Editable
          className="field-content"
          value={contents[field]}
          send={(data) =>
            send({ type: "UPDATE_FIELD", data: { field, value: data } })
          }
        />
      </div>
    ));
  if (displayFields === "all") {
    const fields = Object.keys(contents).filter(
      (key) => !STATIC_FIELDS.includes(key)
    );
    return renderFields(fields);
  }
  return renderFields(displayFields);
}

// This thing is gonna get messy
// FIXME I don't like prop-drilling the send function.
function parseTemplate({ contents, template, send }) {
  const { displayFields, labelFields } = template;
  return (
    <div className="card">
      <h2 data-field="title" className="card-title">
        {contents.title}
      </h2>
      <div className="card-meta">
        <i>{contents.modifier === "" ? "Signalman User" : contents.modifier}</i>
        <small>created: {new Date(contents.created).toLocaleString()}</small>
        <small>modified: {new Date(contents.modified).toLocaleString()}</small>
        <small>
          <i>{contents.id}</i>
        </small>
      </div>
      <div className="card-body">
        {parseTemplateFields(displayFields, labelFields, contents, send)}
      </div>
    </div>
  );
}

export function Card({ contents, template }) {
  const [_, send] = useMachine(cardUpdateMachine.withContext({ ...contents }));
  return parseTemplate({ contents, template, send });
}
