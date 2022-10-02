import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { matchRoutes } from "react-router-dom";
import browser from "webextension-polyfill";

import App from "./App";
import { store } from "./app/store";
import { getConfig } from "./lib/config";
import { ROUTES } from "./lib/routes";
import "./main.scss";

browser.runtime.onMessage.addListener((message) => {
  console.log("message!", message);
  const styleEl = document.getElementById("rju-style");

  if (styleEl) {
    styleEl.innerHTML = message;
  }
});

browser.runtime.sendMessage("ShowPageAction");

async function main() {
  // make sure the current page is supported
  if (!matchRoutes(ROUTES, window.location.pathname)) {
    return;
  }

  const { documentElement } = document;

  // TODO: show loader
  const loader = document.createElement("div");
  loader.style.position = "fixed";
  loader.style.top = "0";
  loader.style.right = "0";
  loader.style.bottom = "0";
  loader.style.left = "0";
  loader.style.backgroundColor = "white";
  loader.style.zIndex = "9999";
  documentElement.appendChild(loader);

  const config = getConfig();
  documentElement.classList.add(config.mode);

  ReactDOM.createRoot(documentElement).render(
    <Provider store={store}>
      <App config={config} />
    </Provider>
  );
}

main();
