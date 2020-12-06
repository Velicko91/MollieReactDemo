import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import MollieComponent from "./MollieComponent";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <MollieComponent />
  </React.StrictMode>,
  rootElement
);
