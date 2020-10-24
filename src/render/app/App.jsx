import "../utility.css";
import React from "react";
import "./app.css";

import { Workspace } from "./views/workspace/index.jsx";
import { Hotkeys } from "./components/Hotkeys.jsx";

export function App() {
  return (
    <div className="app-workspace">
      <Workspace />
      <span>
        <kbd>ctrl + n</kbd> to create new card
      </span>
      <Hotkeys />
    </div>
  );
}
