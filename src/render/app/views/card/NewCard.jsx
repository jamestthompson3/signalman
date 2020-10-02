import React from "react";
import { useMachine } from "@xstate/react";
import { cardSaveMachine } from "machines/card-save.machine";

export function NewCard({ close, open, template }) {
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
