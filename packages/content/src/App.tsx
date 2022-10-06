import { useEffect } from "react";

import { browser, STORAGE_KEYS } from "@rju/core";
import { Listing, TConfig } from "@rju/types";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useAppDispatch } from "./app/hooks";
import { update } from "./app/slices/pageData";
import PageLayout from "./containers/PageLayout";
import {
  getTemplateContext,
  sendSandboxMessage,
  startListeners,
} from "./lib/message";
import { getJsonPath, ROUTES } from "./lib/routes";

type AppProps = {
  config: TConfig;
};

const router = createBrowserRouter(ROUTES);

export default function App({ config }: AppProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function init() {
      const jsonLocation = getJsonPath(config);
      const result = await fetch(jsonLocation, {
        headers: {
          "Cache-Control": "max-age=300",
        },
      });
      const json = await result.json();
      console.log("json", json);

      const listing = new Listing();
      const parsed = listing.parse(json);
      console.log("parsed", parsed);

      startListeners(parsed, config);
      dispatch(update(parsed));

      // BUG: race condition here?
      const template = await browser.storage.sync.get(
        STORAGE_KEYS.CURRENT_TEMPLATE.subreddit
      );

      if (
        Object.prototype.hasOwnProperty.call(
          template,
          STORAGE_KEYS.CURRENT_TEMPLATE.subreddit
        )
      ) {
        sendSandboxMessage({
          template: template[STORAGE_KEYS.CURRENT_TEMPLATE.subreddit],
          context: getTemplateContext(parsed, config),
        });
      }
    }

    init();
  }, []);

  return <></>;

  return (
    <PageLayout>
      <RouterProvider router={router} />
    </PageLayout>
  );
}
