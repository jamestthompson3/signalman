import "../utility.css";
import React from "react";
import { CardView } from "./views/CardView.jsx";
import { useMachine } from "@xstate/react";
import { workspaceMachine } from "machines/workspace-general.machine.js";

export function App() {
  const [currentState, send] = useMachine(workspaceMachine);
  const { context } = currentState;
  console.log(context);
  return context.state ? (
    <div className="workspace">
      <h1>{context.state.name}</h1>
      <CardView contents={context.shown} />
      <span>
        <kbd>ctrl + n</kbd> to create new card
      </span>
    </div>
  ) : null;
}
