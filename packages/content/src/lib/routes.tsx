import { TConfig } from "@rju/types";
import { RouteObject } from "react-router-dom";

import PostList from "../components/PostList";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <PostList />,
  },
  {
    path: "/r/:subreddit",
    element: <PostList />,
  },
  {
    path: "/r/:subreddit/comments/:author/:post",
    element: <div>Comments</div>,
  },
];

export function getJsonPath(config: TConfig) {
  const {
    location: { pathname },
  } = window;

  return `//${config.hostname}${pathname}.json?limit=30`;
}
