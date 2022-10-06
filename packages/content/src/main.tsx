import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { matchRoutes } from "react-router-dom";

import App from "./App";
import { store } from "./app/store";
import { getConfig } from "./lib/config";
import { handleMessageEvent } from "./lib/message";
import { ROUTES } from "./lib/routes";
import "./main.scss";

async function main() {
  // make sure the current page is supported
  if (!matchRoutes(ROUTES, window.location.pathname)) {
    return;
  }

  const { documentElement } = document;

  // create style element
  const style = document.createElement("style");
  style.id = "rju-style";
  documentElement.appendChild(style);

  // create root element
  const root = document.createElement("div");
  root.id = "rju-root";
  documentElement.appendChild(root);

  // add configuration mode class to html element
  const config = getConfig();
  documentElement.classList.add(config.mode);

  // fetch css from storage and apply
  const currentStyle = browser.storage.sync.get(STORAGE_KEYS.CURRENT_STYLE);
  currentStyle.then((res) => {
    if (Object.prototype.hasOwnProperty.call(res, STORAGE_KEYS.CURRENT_STYLE)) {
      handleMessageEvent({
        action: MESSAGE_ACTIONS.UPDATE_STYLE,
        value: res[STORAGE_KEYS.CURRENT_STYLE],
      });
    }
  });

  ReactDOM.createRoot(root).render(
    <Provider store={store}>
      <div id="rju-content">
        <App config={config} />
      </div>
      <iframe id="rju-sandbox" src={browser.runtime.getURL("sandbox.html")} />
    </Provider>
  );
}

main();
