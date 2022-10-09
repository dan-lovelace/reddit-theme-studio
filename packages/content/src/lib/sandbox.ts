import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import { Comments, Listing, TConfig, TSandboxContext } from "@rju/types";

import { LINKS } from "../components/Header/Header";
import { sendSandboxMessage, startListeners } from "./message";
import { getJsonPath } from "./routes";

const whiteLogo = browser.runtime.getURL("reddit_logo_32.png");

export function getTemplateContext<T>(
  data: T,
  config: TConfig
): TSandboxContext<T> {
  return {
    data,
    logo: {
      white: whiteLogo,
    },
    subreddits: LINKS,
    config,
  };
}

export function handleSandboxLoad({
  config,
  initialize,
}: {
  config: TConfig;
  initialize: () => void;
}) {
  return async () => {
    const { view } = config;
    const jsonLocation = getJsonPath(config);
    const result = await fetch(jsonLocation, {
      headers: {
        "Cache-Control": "max-age=300",
      },
    });
    const json = await result.json();
    console.log("json", json);

    switch (view) {
      case "comments": {
        const commentsData = new Comments().parse(json);
        console.log("commentsData", commentsData);

        startListeners(commentsData, config);

        const savedTemplate = await browser.storage.sync.get(
          STORAGE_KEYS.CURRENT_TEMPLATE[view]
        );

        if (
          Object.prototype.hasOwnProperty.call(
            savedTemplate,
            STORAGE_KEYS.CURRENT_TEMPLATE[view]
          )
        ) {
          sendSandboxMessage({
            context: getTemplateContext(commentsData, config),
            event: {
              action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
              value: savedTemplate[STORAGE_KEYS.CURRENT_TEMPLATE[view]],
            },
          });
        } else {
          // TODO: serve default template
        }

        break;
      }

      case "subreddit": {
        const subredditData = new Listing().parse(json);
        console.log("subredditData", subredditData);

        startListeners(subredditData, config);

        const savedTemplate = await browser.storage.sync.get(
          STORAGE_KEYS.CURRENT_TEMPLATE[view]
        );

        if (
          Object.prototype.hasOwnProperty.call(
            savedTemplate,
            STORAGE_KEYS.CURRENT_TEMPLATE[view]
          )
        ) {
          sendSandboxMessage({
            context: getTemplateContext(subredditData.data, config),
            event: {
              action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
              value: savedTemplate[STORAGE_KEYS.CURRENT_TEMPLATE[view]],
            },
          });
        } else {
          // TODO: serve default template
        }
        break;
      }
    }

    initialize();
  };
}
