import ReactDom from "react-dom";
import * as React from "react";
import Alert from "./alert.tsx";
import Emotion from "./Emotion.jsx";

const ReactApp = (props) => {
  return (
    <div>
      <h1 style={{ color: "#000" }}>React test!!!</h1>
      <Alert message="Success!" />
      <Emotion />
    </div>
  );
};

const reactRoot = document.getElementById("root");
if (reactRoot) {
  ReactDom.render(<ReactApp />, reactRoot);
} else {
  console.log("no react");
}
