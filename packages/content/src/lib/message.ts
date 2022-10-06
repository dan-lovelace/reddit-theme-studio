import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import {
  TConfig,
  TListing,
  TListingContext,
  TMessageEvent,
  TSandboxMessage,
} from "@rju/types";

import { LINKS } from "../components/Header/Header";

const logo = browser.runtime.getURL("reddit_logo_32.png");

export function getTemplateContext(
  pageData: TListing,
  config: TConfig
): TListingContext {
  return {
    data: pageData.data,
    logo,
    subreddits: LINKS,
    config,
  };
}

export function handleMessageEvent(event: TMessageEvent) {
  const { action, value } = event;

  switch (action) {
    case MESSAGE_ACTIONS.UPDATE_STYLE: {
      const styleEl = document.getElementById("rju-style") as HTMLStyleElement;

      styleEl.innerHTML = value;
      break;
    }

    case MESSAGE_ACTIONS.UPDATE_TEMPLATE: {
      const content = document.getElementById("rju-content") as HTMLDivElement;

      content.innerHTML = value;
      break;
    }

    default:
      throw new Error("Unknown message event action");
  }
}

export function sendSandboxMessage(message: TSandboxMessage) {
  const sandbox = document.getElementById("rju-sandbox") as HTMLIFrameElement;

  sandbox.contentWindow?.postMessage(message, "*");
}

export function startListeners(pageData: TListing, config: TConfig) {
  browser.runtime.onMessage.addListener((event: TMessageEvent) => {
    handleMessageEvent(event);
  });

  browser.storage.onChanged.addListener((event) => {
    const {
      [STORAGE_KEYS.CURRENT_TEMPLATE.subreddit]: { newValue },
    } = event;

    sendSandboxMessage({
      template: newValue,
      context: getTemplateContext(pageData, config),
    });
  });

  window.addEventListener("message", (event: MessageEvent<TMessageEvent>) => {
    handleMessageEvent(event.data);
  });
}
