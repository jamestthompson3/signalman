import React from "react";

const STATIC_FIELDS = ["created", "modified", "modifier", "title"];

// very naive first pass
function parseTemplateFields(displayFields, labelFields, contents) {
  const renderFields = (fields) =>
    fields.map((field) => (
      <div className="card-field" key={field}>
        {labelFields && <p>{field}: </p>}
        <p contentEditable>{contents[field]}</p>
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
function parseTemplate({ contents, template }) {
  const { displayFields, labelFields } = template;
  return (
    <div className="card">
      <h2 data-field="title" className="card-title">
        {contents.title}
      </h2>
      <div className="card-meta">
        <i>{contents.modifier}</i>
        <small>created: {new Date(contents.created).toLocaleString()}</small>
        <small>modified: {new Date(contents.modified).toLocaleString()}</small>
      </div>
      <div className="card-body">
        {parseTemplateFields(displayFields, labelFields, contents)}
      </div>
    </div>
  );
}

export function Card({ contents, template }) {
  return parseTemplate({ contents, template });
}
