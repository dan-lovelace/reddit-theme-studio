import { browser } from "@rts/core";

function main() {
  browser.runtime.onInstalled.addListener(() => {
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

  const { manifest_version } = browser.runtime.getManifest();
  if (manifest_version === 2) {
    browser.webRequest.onBeforeRequest.addListener(
      (details) => {
        // hostname checking here because of host permissions. the manifest
        // needs both legacy and redesign domains but we only want to block
        // stylesheets for legacy to avoid an infinite loop in redesign.
        const { hostname } = new URL(String(details.originUrl));
        const cancel = hostname === "old.reddit.com";

        return { cancel };
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
