import "../utility.css";
import React from "react";

import { Workspace } from "./views/workspace/index.jsx";
import { Hotkeys } from "./components/Hotkeys.jsx";

export function App() {
  return (
    <div className="workspace">
      <Workspace />
      <span>
        <kbd>ctrl + n</kbd> to create new card
      </span>
      <Hotkeys />
    </div>
  );
}
