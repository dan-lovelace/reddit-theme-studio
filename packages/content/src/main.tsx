import { getCurrentTheme } from "@rts/core";
import ReactDOM from "react-dom/client";

import App from "./App";
import { getConfig } from "./lib/config";
import "./main.scss";

async function main() {
  const config = getConfig();

  // return if current page is unsupported
  if (!config.view) return;

  const { documentElement } = document;
  const currentTheme = await getCurrentTheme(config);
  if (currentTheme) {
    // add configuration mode to html element class list to support styling
    // legacy and redesign separately
    documentElement.classList.add(config.mode);

    // remove reddit styles to reduce clashing with theme styles
    switch (config.mode) {
      case "redesign": {
        // redesign styles exist in head, just remove them. attempting to block
        // stylsheet resources, as seen in the legacy handler, creates an
        // infinite loop with reddit's javascript and will eventually crash the
        // browser.
        const styles = document.head.querySelectorAll("style");
        for (const styleEl of styles) {
          styleEl.remove();
        }
        break;
      }

      case "legacy": {
        // legacy styles are loaded through stylesheet files and are blocked at
        // the network level using the declarativeNetRequest permission and
        // ruleset in manifest v3 (see: content/public/request_rules.json) and
        // web request blocking in v2 (see: background/src/index.ts).
        break;
      }
    }
  }

  // create style element
  const style = document.createElement("style");
  style.id = "rts-style";
  documentElement.appendChild(style);

  // create root element
  const root = document.createElement("div");
  root.id = "rts-root";
  documentElement.appendChild(root);

  ReactDOM.createRoot(root).render(<App config={config} />);
}

main();
