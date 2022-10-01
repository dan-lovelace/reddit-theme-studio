import ReactDOM from "react-dom/client";

import App from "./App";
import { getConfig } from "./lib/config";
import { getJsonPath } from "./lib/routes";
import "./main.css";

async function main() {
  // TODO: show loader
  const loader = document.createElement("div");
  loader.style.position = "fixed";
  loader.style.top = "0";
  loader.style.right = "0";
  loader.style.bottom = "0";
  loader.style.left = "0";
  loader.style.backgroundColor = "white";
  loader.style.zIndex = "9999";
  document.documentElement.appendChild(loader);

  const config = getConfig();
  const jsonLocation = getJsonPath(config);
  const result = await fetch(jsonLocation);
  const json = await result.json();
  console.log("json", json);

  window.onload = () => {
    console.log("window loaded");
  };

  ReactDOM.createRoot(document.documentElement).render(<App />);
}

main();
