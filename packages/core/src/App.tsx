import { useEffect } from "react";

import { TConfig } from "@rju/types";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { z } from "zod";

import { useAppDispatch } from "./app/hooks";
import { update } from "./app/slices/pageData";
import PageLayout from "./containers/PageLayout";
import { getJsonPath, ROUTES } from "./lib/routes";

type AppProps = {
  config: TConfig;
};

const router = createBrowserRouter(ROUTES);

const PageDataResult = z.object({
  children: z.array(
    z.object({
      data: z.object({
        author: z.string(),
        downs: z.number(),
        num_comments: z.number(),
        permalink: z.string(),
        preview: z
          .object({
            images: z.array(
              z.object({
                source: z.object({
                  url: z.string(),
                }),
              })
            ),
          })
          .optional(),
        subreddit: z.string(),
        subreddit_name_prefixed: z.string(),
        thumbnail: z.string(),
        title: z.string(),
        ups: z.number(),
        url: z.string(),
      }),
    })
  ),
});

export default function App({ config }: AppProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function init() {
      const jsonLocation = getJsonPath(config);
      const result = await fetch(jsonLocation, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const json = await result.json();
      console.log("json", json);

      const parsed = PageDataResult.parse(json.data);
      console.log("parsed", parsed);

      dispatch(update(parsed));

      const style = document.createElement("style");
      style.id = "rju-style";
      document.documentElement.appendChild(style);
    }

    init();
  }, []);

  return (
    <PageLayout>
      <RouterProvider router={router} />
    </PageLayout>
  );
}
