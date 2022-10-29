import { getCurrentTheme } from "@rju/core";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./app/store";
import { getConfig } from "./lib/config";
import "./main.scss";

async function main() {
  const config = getConfig();

  // return if current page is unsupported
  if (!config.view) return;

  const { documentElement } = document;

  const currentTheme = await getCurrentTheme(config);
  if (currentTheme) {
    // add configuration mode to html element class list
    documentElement.classList.add(config.mode);
  }

  // create style element
  const style = document.createElement("style");
  style.id = "rju-style";
  documentElement.appendChild(style);

  // create root element
  const root = document.createElement("div");
  root.id = "rju-root";
  documentElement.appendChild(root);

  ReactDOM.createRoot(root).render(
    <Provider store={store}>
      <App config={config} />
    </Provider>
  );
}

main();
