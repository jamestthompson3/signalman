import React from "react";
import ReactDOM from "react-dom";

export function Portal({ children }) {
  const [rootMounted, setRootMounted] = React.useState(false);
  React.useEffect(() => {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modalRoot";
    document.body.appendChild(modalRoot);
    setRootMounted(true);
    return () => document.body.removeChild(modalRoot);
  }, []);
  return rootMounted
    ? ReactDOM.createPortal(children, document.getElementById("modalRoot"))
    : null;
}
