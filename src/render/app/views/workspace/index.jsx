import React from "react";
import { useService } from "@xstate/react";
import { CardView } from "../card/index.jsx";
import { NewCard } from "../card/NewCard.jsx";
import { ListView } from "../list/index.jsx";
import { Search } from "../search/index.jsx";
import { WorkspaceTitle } from "./WorkspaceTitle.jsx";
import { workspaceDriver } from "../../utils/eventMachines";
import "./workspace.css";

const workspaceService = workspaceDriver.init(true);

export function Workspace() {
  const [showDialog, setShowDialog] = React.useState(false);
  const [currentState] = useService(workspaceService);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const { context } = currentState;
  console.log({ context });
  React.useEffect(() => {
    return () => workspaceDriver.stop();
  }, []);
  React.useEffect(() => {
    const newCard = (e) => {
      if (e.ctrlKey && e.key === "n") {
        open();
      }
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", newCard);
    () => document.removeEventListener("keydown", newCard, true);
  }, []);
  if (!context.state) return null;
  return (
    <>
      <WorkspaceTitle name={context.state.name} />
      <Search />
      <NewCard
        open={showDialog}
        close={close}
        template={context.shown.templates["basic-view"]}
      />
      <div className="workspace-view-container">
        <ListView contents={context.shown} />
        <CardView
          contents={{
            cards: context.today,
            templates: context.shown.templates,
          }}
        />
      </div>
    </>
  );
}
