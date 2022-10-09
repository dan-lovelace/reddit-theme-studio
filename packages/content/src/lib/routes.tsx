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
    path: "/r/:subreddit/comments/:author/:post",
    view: "comments",
  },
];

export function getJsonPath({ hostname }: TConfig) {
  const {
    location: { pathname },
  } = window;

  return `//${hostname}${pathname}.json?limit=30`;
}
