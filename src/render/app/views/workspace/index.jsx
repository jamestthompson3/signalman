import React from "react";
import groupBy from "lodash/groupBy";
import { useService } from "@xstate/react";
import { NewCard } from "../card/NewCard.jsx";
import { Search } from "../search/index.jsx";
import { Inboxes } from "../inbox/index.jsx";
import { WorkspaceTitle } from "./WorkspaceTitle.jsx";
import { workspaceDriver } from "../../utils/eventMachines";
import "./workspace.css";

const workspaceService = workspaceDriver.init(true);

export function Workspace() {
  const [showDialog, setShowDialog] = React.useState(false);
  const [currentState] = useService(workspaceService);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const {
    context: { state, shown },
  } = currentState;
  // console.log({ context });
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
  if (!state) return null;
  // const shownCards = {
  //   ...shown,
  //   cards: shown.cards
  // };
  const inboxes = groupBy(shown.cards, "inbox");
  return (
    <>
      <WorkspaceTitle name={state.name} />
      <Search />
      <NewCard
        open={showDialog}
        close={close}
        template={shown.templates["basic-view"]}
      />
      <div className="workspace-view-container">
        <Inboxes inboxes={inboxes} templates={shown.templates} />
        {/*<ListView contents={shownCards} />*/}
      </div>
    </>
  );
}
