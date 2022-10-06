import { TConfig } from "@rju/types";
import { RouteObject } from "react-router-dom";

import Subreddit from "../components/Subreddit";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <Subreddit />,
  },
  {
    path: "/r/:subreddit",
    element: <Subreddit />,
  },
  {
    path: "/r/:subreddit/comments/:author/:post",
    element: <div>Comments</div>,
  },
];

export function getJsonPath({ hostname }: TConfig) {
  const {
    location: { pathname },
  } = window;

  return `//${hostname}${pathname}.json?limit=30`;
}
