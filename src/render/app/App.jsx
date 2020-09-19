import "../utility.css";
import React from "react";
import { CardView } from "./views/CardView.jsx";
import { useMachine } from "@xstate/react";
import { workspaceMachine } from "machines/workspace-general.machine.js";
import { workspaceEmitter } from "./utils/emitter";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD, RELOAD_STATE } = MESSAGES;

export function App() {
  const [currentState, send, service] = useMachine(workspaceMachine);
  // React.useEffect(() => {
  //   service.onEvent(console.log);
  // }, []);
  const { context } = currentState;
  console.log({ context });
  React.useEffect(() => {
    // allow for global updates to be called from atomic actions (like saving a new card)
    workspaceEmitter.on(WORKSPACE_REMOVE_CARD, (id) => {
      send({ type: "REMOVE_CARD", data: id });
    });
    workspaceEmitter.on(RELOAD_STATE, (data) => {
      send({ type: RELOAD_STATE, data });
    });
  }, []);
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
