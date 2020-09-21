import React from "react";
import { workspaceEmitter } from "../utils/emitter";
import { MESSAGES } from "global/constants/bridge";

const { WORKSPACE_NAME_UPDATE } = MESSAGES;

export function WorkspaceTitle({ name }) {
  const [title, setTitle] = React.useState(name);
  React.useEffect(() => {
    workspaceEmitter.on(WORKSPACE_NAME_UPDATE, data => {
      setTitle(data);
    });
  }, []);
  return <h1>{title}</h1>;
}
