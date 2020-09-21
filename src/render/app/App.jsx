import "../utility.css";
import React from "react";
import { CardView } from "./views/CardView.jsx";
import { WorkspaceTitle } from "./components/WorkspaceTitle.jsx";
import { useService } from "@xstate/react";
import { workspaceDriver } from "./utils/eventMachines";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_REMOVE_CARD, RELOAD_STATE, WORKSPACE_LOADED } = MESSAGES;
const workspaceService = workspaceDriver.init();

export function App() {
  const [currentState, send] = useService(workspaceService);
  const { context } = currentState;
  console.log({ context });
  React.useEffect(() => {
    return () => workspaceDriver.stop();
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
