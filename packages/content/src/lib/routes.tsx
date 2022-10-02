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

  switch (pathname) {
    case "/":
      return `https://${config.hostname}/r/popular.json`;
    default: {
      const replaced = pathname.replace(/\/$/g, "");

      return `https://${config.hostname}${replaced}.json`;
    }
  }
}
