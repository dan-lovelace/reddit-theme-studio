import { browser, STORAGE_KEYS } from "@rju/core";
import {
  Comments,
  Listing,
  TConfig,
  TListing,
  TListingContext,
} from "@rju/types";

import { LINKS } from "../components/Header/Header";
import { sendSandboxMessage, startListeners } from "./message";
import { getJsonPath } from "./routes";

const whiteLogo = browser.runtime.getURL("reddit_logo_32.png");

export function getTemplateContext(
  listing: TListing,
  config: TConfig
): TListingContext {
  return {
    data: listing.data,
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
    const jsonLocation = getJsonPath(config);
    const result = await fetch(jsonLocation, {
      headers: {
        "Cache-Control": "max-age=300",
      },
    });
    const json = await result.json();
    console.log("json", json);

    switch (config.view) {
      case "comments": {
        const commentsData = new Comments().parse(json);
        console.log("commentsData", commentsData);
        break;
      }

      case "subreddit": {
        const subredditData = new Listing().parse(json);
        console.log("subredditData", subredditData);

        startListeners(subredditData, config);

        const savedTemplate = await browser.storage.sync.get(
          STORAGE_KEYS.CURRENT_TEMPLATE.subreddit
        );

        if (
          Object.prototype.hasOwnProperty.call(
            savedTemplate,
            STORAGE_KEYS.CURRENT_TEMPLATE.subreddit
          )
        ) {
          sendSandboxMessage({
            template: savedTemplate[STORAGE_KEYS.CURRENT_TEMPLATE.subreddit],
            context: getTemplateContext(subredditData, config),
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
