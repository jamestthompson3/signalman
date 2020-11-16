import React from "react";
import { useService } from "@xstate/react";
import { CardView } from "../card/index.jsx";
import { NewCard } from "../card/NewCard.jsx";
import { ListView } from "../list/index.jsx";
import { Search } from "../search/index.jsx";
import { WorkspaceTitle } from "./WorkspaceTitle.jsx";
import { workspaceDriver } from "../../utils/eventMachines";
import "./workspace.css";
import dayjs from "dayjs";

const workspaceService = workspaceDriver.init(true);

export function Workspace() {
  const [showDialog, setShowDialog] = React.useState(false);
  const [currentState] = useService(workspaceService);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  const {
    context: { state, shown, today },
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
  const shownCards = {
    ...shown,
    cards: shown.cards.filter((card) =>
      !card.scheduled ? true : !dayjs().isSame(card.scheduled, "day")
    ),
  };
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
        <ListView contents={shownCards} />
        <CardView
          contents={{
            cards: today,
            templates: shown.templates,
          }}
        />
      </div>
    </>
  );
}
