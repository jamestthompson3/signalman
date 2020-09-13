import React from "react";
import { DialogOverlay, DialogContent, Dialog } from "@reach/dialog";
import { useMachine } from "@xstate/react";

import { cardSaveMachine } from "machines/card-save.machine";
import { Card } from "./Card.jsx";
import { Editable } from "common/components/ContentEditable.jsx";
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
          template={templates[card.viewTemplate]}
          key={card.title}
        />
      ))}
    </>
  );
}

function NewCard({ close, open, template }) {
  const [_, send] = useMachine(cardSaveMachine);
  const saveAndClose = () => {
    send({ type: "SAVE_CARD" });
    close();
  };
  return open ? (
    <div className="card">
      <form onSubmit={saveAndClose}>
        <Editable
          className="field-content"
          value=""
          send={(data) =>
            send({ type: "UPDATE_FIELD", data: { field: "text", value: data } })
          }
        />
        <button type="submit" onClick={saveAndClose}>
          save
        </button>
      </form>
    </div>
  ) : null;
}
