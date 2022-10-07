import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import { TConfig, TListing, TMessageEvent, TSandboxMessage } from "@rju/types";

import { getTemplateContext } from "./sandbox";

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
  const { contentWindow } = sandbox;

  contentWindow?.postMessage(message, "*");
}

export function startListeners(listing: TListing, config: TConfig) {
  browser.runtime.onMessage.addListener((event: TMessageEvent) => {
    handleMessageEvent(event);
  });

  browser.storage.onChanged.addListener((event) => {
    for (const key of Object.keys(event)) {
      switch (key) {
        case STORAGE_KEYS.CURRENT_TEMPLATE.comments:
        case STORAGE_KEYS.CURRENT_TEMPLATE.subreddit: {
          const {
            [key]: { newValue },
          } = event;

          sendSandboxMessage({
            template: newValue,
            context: getTemplateContext(listing, config),
          });
          break;
        }
      }
    }
  });

  window.addEventListener("message", (event: MessageEvent<TMessageEvent>) => {
    handleMessageEvent(event.data);
  });
}
