import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import {
  Comments,
  Listing,
  TConfig,
  TSandboxContext,
  TView,
  TViewInputValue,
} from "@rju/types";

import { LINKS } from "../components/Header/Header";
import { sendSandboxMessage, startListeners } from "./message";
import { getJson } from "./routes";

const whiteLogo = browser.runtime.getURL("reddit_logo_32.png");

function getDefaultTemplate(view: TView): TViewInputValue {
  return {
    partials: [],
    template: `<div>Error: No template found for view '${view}'. Use the editor to create one.</div>`,
  };
}

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

    switch (view) {
      case "comments": {
        const json = await getJson(config);
        const commentsData = new Comments().parse(json);
        console.log("commentsData", commentsData);

        initSandbox(config, commentsData);
        break;
      }

      case "subreddit": {
        const json = await getJson(config, {
          limit: "30",
        });
        const subredditData = new Listing().parse(json);
        console.log("subredditData", subredditData);

        initSandbox(config, subredditData);
        break;
      }
    }

    initialize();
  };
}

export async function initSandbox<T>(config: TConfig, data: T) {
  startListeners(data, config);

  const storageKey = STORAGE_KEYS.CURRENT_TEMPLATE[config.view];
  const savedTemplate = await browser.storage.sync.get(storageKey);
  const context = getTemplateContext(data, config);
  const value = Object.prototype.hasOwnProperty.call(savedTemplate, storageKey)
    ? savedTemplate[storageKey]
    : getDefaultTemplate(config.view);

  sendSandboxMessage({
    context: context,
    event: {
      action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
      value: value,
    },
  });
}
