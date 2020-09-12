import "../utility.css";
import React from "react";
import { CardView } from "./views/CardView.jsx";
import { useMachine } from "@xstate/react";
import { workspaceMachine } from "machines/workspace-general.machine.js";

function handleShortcuts(send) {
  return (e) => {
    if (e.ctrlKey && event.key === "n") {
      send("NEW_CARD");
    }
  };
}

export function App() {
  const [currentState, send] = useMachine(workspaceMachine);
  const { context } = currentState;
  React.useEffect(() => {
    document.addEventListener("keydown", handleShortcuts(send));
    return document.removeEventListener("keydown", handleShortcuts(send), true);
  }, []);
  console.log(context);
  return context.state ? (
    <>
      <h1>{context.state.name}</h1>
      <CardView contents={context.shown} />
      <kbd>ctrl + n</kbd> to create new card
    </>
  ) : null;
}
