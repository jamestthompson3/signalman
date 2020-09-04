import React from "react";
import { Machine, assign } from "xstate";

import { send } from "../utils/messagePassing.js";

export const cardviewMachine = Machine(
  {
    id: "cardview-general",
    initial: "idle",
    strict: "true",
    context: {
      cards: () => <h1>Loading</h1>
    },
    states: {
      idle: {
        entry: "requestCards",
        on: {
          CARDS_LOADED: "RENDER"
        }
      },
      RENDER: {
        entry: "saveCards"
      }
    }
  },
  {
    actions: {
      requestCards: () => send("requestWorkspace"),
      saveCards: assign({
        cards: (_, e) => () => {
          console.log({ e });
          return e.data.map(card => (
            <div className="card" key={card.title}>
              <h2 className="card-title">{card.title}</h2>
              {card.text}
            </div>
          ));
        }
      })
    }
  }
);
