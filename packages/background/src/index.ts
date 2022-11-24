import { browser, STORAGE_KEYS } from "@rts/core";
import { TCurrentTheme } from "@rts/types";

const { CURRENT_THEME } = STORAGE_KEYS;

function main() {
  const { manifest_version } = browser.runtime.getManifest();

  browser.runtime.onInstalled.addListener(async () => {
    // apply default theme if no current theme exists such as in a fresh install
    const storedCurrentTheme = await browser.storage.local.get(CURRENT_THEME);
    const currentTheme = storedCurrentTheme[CURRENT_THEME];

    if (!currentTheme) {
      const defaultTheme: TCurrentTheme = {
        id: "default",
        label: "Default",
        type: "premade",
      };

      await browser.storage.local.set({
        [CURRENT_THEME]: defaultTheme,
      });
    }

    // enable/disable browser action based on selected tab
    browser.action.disable();
    browser.declarativeContent.onPageChanged.removeRules(undefined, () => {
      browser.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new browser.declarativeContent.PageStateMatcher({
              pageUrl: { hostSuffix: "reddit.com" },
            }),
          ],
          actions: [new browser.declarativeContent.ShowAction()],
        },
      ]);
    });
  });

  browser.runtime.onMessage.addListener(async (message) => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tabs[0].id ?? -1;

    browser.tabs.sendMessage(tabId, message);
  });

  if (manifest_version === 2) {
    browser.webRequest.onBeforeRequest.addListener(
      (details) => {
        // hostname checking here because of host permissions. the manifest
        // needs both legacy and redesign domains but we only want to block
        // stylesheets for legacy to avoid an infinite loop in redesign.
        const { hostname } = new URL(String(details.originUrl));

        return { cancel: hostname === "old.reddit.com" };
      },
      {
        // urls must include initiator origin (reddit.com)
        urls: ["https://*.reddit.com/*", "https://www.redditstatic.com/*"],
        types: ["stylesheet"],
      },
      ["blocking"]
    );
  }
}

main();
