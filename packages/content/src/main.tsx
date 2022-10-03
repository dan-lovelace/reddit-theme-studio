import { browser, STORAGE_KEYS } from "@rju/core";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { matchRoutes } from "react-router-dom";

import App from "./App";
import { store } from "./app/store";
import { getConfig } from "./lib/config";
import { ROUTES } from "./lib/routes";
import "./main.scss";

browser.runtime.onMessage.addListener((message) => {
  const { action, value } = message;

  if (action === "update-style") {
    const styleEl = document.getElementById("rju-style");

    if (styleEl) {
      styleEl.innerHTML = value;
    }
  }
});

async function main() {
  // make sure the current page is supported
  if (!matchRoutes(ROUTES, window.location.pathname)) {
    return;
  }

  const { documentElement } = document;

  const style = document.createElement("style");
  style.id = "rju-style";
  documentElement.appendChild(style);

  const root = document.createElement("div");
  root.id = "root";
  documentElement.appendChild(root);

  const currentStyle = browser.storage.sync.get(STORAGE_KEYS.CURRENT_STYLE);
  currentStyle.then((res) => {
    if (Object.prototype.hasOwnProperty.call(res, STORAGE_KEYS.CURRENT_STYLE)) {
      const styleEl = document.getElementById("rju-style");

      if (styleEl) {
        styleEl.innerHTML = res[STORAGE_KEYS.CURRENT_STYLE];
      }
    }
  });

  const config = getConfig();
  documentElement.classList.add(config.mode);

  ReactDOM.createRoot(root).render(
    <Provider store={store}>
      <App config={config} />
    </Provider>
  );
}

main();
