import { TConfig, TView } from "@rju/types";
import { RouteObject } from "react-router-dom";

type Route = RouteObject & {
  view: TView;
};

export const ROUTES: Route[] = [
  {
    path: "/",
    view: "subreddit",
  },
  {
    path: "/r/:subreddit",
    view: "subreddit",
  },
  {
    path: "/r/:subreddit/comments/:author/:post/*",
    view: "comments",
  },
];

export const getJson: (
  config: TConfig,
  params?: Record<string, string>
) => any = async (config, params) => {
  const {
    location: { pathname },
  } = window;

  const url = `https://${config.hostname}${pathname}.json${
    params ? `?${new URLSearchParams(params).toString()}` : ""
  }`;
  const result = await fetch(url, {
    headers: {
      "Cache-Control": "max-age=300",
    },
  });
  const json = await result.json();
  console.log("raw json", json);

  return json;
};
