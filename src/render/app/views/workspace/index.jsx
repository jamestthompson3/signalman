import React from "react";
import { useService } from "@xstate/react";
import { CardView } from "../CardView.jsx";
import { Search } from "../Search.jsx";
import { WorkspaceTitle } from "./WorkspaceTitle.jsx";
import { workspaceDriver } from "../../utils/eventMachines";

const workspaceService = workspaceDriver.init();

export function Workspace() {
  const [currentState] = useService(workspaceService);
  const { context } = currentState;
  console.log({ context });
  React.useEffect(() => {
    return () => workspaceDriver.stop();
  }, []);
  if (!context.state) return null;
  return (
    <>
      <WorkspaceTitle name={context.state.name} />
      <Search />
      <CardView contents={context.shown} />
    </>
  );
}
