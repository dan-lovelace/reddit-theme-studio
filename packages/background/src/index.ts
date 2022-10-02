import { browser } from "@rju/core";

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
}

main();
