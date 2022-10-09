import { browser, MESSAGE_ACTIONS, STORAGE_KEYS } from "@rju/core";
import { TConfig, TMessageEvent, TSandboxMessage } from "@rju/types";

import { getTemplateContext } from "./sandbox";

export function handleMessageEvent(event: TMessageEvent<string>) {
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

export function sendSandboxMessage<T>(message: TSandboxMessage<T>) {
  const sandbox = document.getElementById("rju-sandbox") as HTMLIFrameElement;
  const { contentWindow } = sandbox;

  contentWindow?.postMessage(message, "*");
}

export function startListeners<T>(data: T, config: TConfig) {
  browser.runtime.onMessage.addListener((event: TMessageEvent<string>) => {
    handleMessageEvent(event);
  });

  browser.storage.onChanged.addListener((event) => {
    for (const key of Object.keys(event)) {
      const {
        [key]: { newValue },
      } = event;

      switch (key) {
        case STORAGE_KEYS.CURRENT_STYLE: {
          sendSandboxMessage({
            event: {
              action: MESSAGE_ACTIONS.UPDATE_STYLE,
              value: newValue,
            },
          });
          break;
        }

        // TODO: only update template if current page matches selected view
        case STORAGE_KEYS.CURRENT_TEMPLATE.comments:
        case STORAGE_KEYS.CURRENT_TEMPLATE.subreddit: {
          sendSandboxMessage({
            context: getTemplateContext(data, config),
            event: {
              action: MESSAGE_ACTIONS.UPDATE_TEMPLATE,
              value: newValue,
            },
          });
          break;
        }
      }
    }
  });

  window.addEventListener(
    "message",
    (event: MessageEvent<TMessageEvent<string>>) => {
      handleMessageEvent(event.data);
    }
  );
}