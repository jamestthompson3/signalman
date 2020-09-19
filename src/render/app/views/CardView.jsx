import React from "react";
import { useMachine } from "@xstate/react";

import { cardSaveMachine } from "machines/card-save.machine";
import { Card } from "./Card.jsx";
import { Editable } from "common/components/ContentEditable.jsx";
import { MESSAGES } from "global/constants/bridge";
import { STATIC_FIELDS } from "./constants";

export function CardView({ contents }) {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  React.useEffect(() => {
    const newCard = (e) => {
      if (e.ctrlKey && event.key === "n") {
        open();
      }
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", newCard);
    () => document.removeEventListener("keydown", newCard, true);
  }, []);
  const templates = contents[1];
  const shown = contents[0];
  return (
    <>
      <NewCard
        open={showDialog}
        close={close}
        template={templates["basic-view"]}
      />
      {shown.map((card) => (
        <Card
          contents={card}
          template={templates[card.viewTemplate] || templates["basic-view"]}
          key={card.id}
        />
      ))}
    </>
  );
}

function NewCard({ close, open, template }) {
  const [_, send] = useMachine(cardSaveMachine);
  const input = React.useRef(null);
  const saveAndClose = () => {
    send({ type: "SAVE_CARD" });
    close();
  };
  React.useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, [open]);
  return open ? (
    <div className="card">
      <form onSubmit={saveAndClose}>
        <textarea
          ref={input}
          className="field-content"
          onChange={(e) =>
            send({
              type: "UPDATE_FIELD",
              data: { field: "text", value: e.target.value },
            })
          }
        />
        <button type="submit" onClick={saveAndClose}>
          save
        </button>
      </form>
    </div>
  ) : null;
}
