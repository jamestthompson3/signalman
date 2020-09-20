import "../utility.css";
import React from "react";
import { CardView } from "./views/CardView.jsx";
import { WorkspaceTitle } from "./components/WorkspaceTitle.jsx";
import { useMachine } from "@xstate/react";
import { workspaceMachine } from "machines/workspace-general.machine";
import { workspaceEmitter } from "./utils/emitter";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD, RELOAD_STATE, WORKSPACE_LOADED } = MESSAGES;

export function App() {
  const [currentState, send] = useMachine(workspaceMachine);
  const { context } = currentState;
  console.log({ context });
  React.useEffect(() => {
    // service.onEvent(console.log);
    // allow for global updates to be called from atomic actions (like saving a new card)
    workspaceEmitter.on(WORKSPACE_REMOVE_CARD, (id) => {
      send({ type: WORKSPACE_REMOVE_CARD, data: id });
    });
    workspaceEmitter.on(WORKSPACE_LOADED, (data) => {
      send({ type: WORKSPACE_LOADED, data });
    });
    workspaceEmitter.on(RELOAD_STATE, (data) => {
      send({ type: RELOAD_STATE, data });
    });
  }, []);
  return context.state ? (
    <div className="workspace">
      <WorkspaceTitle name={context.state.name} />
      <CardView contents={context.shown} />
      <span>
        <kbd>ctrl + n</kbd> to create new card
      </span>
    </div>
  ) : null;
}
