import * as React from "react";
import { render } from "react-dom";
import { App } from "./app/App.jsx";
import "./reset.css";
import "./theme.css";

render(<App />, document.getElementById("app"));
