import type { TConfig, TMode } from "@rts/types";
import { matchRoutes } from "react-router-dom";

import { ROUTES } from "./routes";

export function getConfig(): TConfig {
  const {
    location: { hostname },
  } = window;
  const mode: TMode = hostname === "old.reddit.com" ? "legacy" : "redesign";
  const route = matchRoutes(ROUTES, window.location.pathname);

  if (!route) throw new Error("Invalid route provided to getConfig()");

  const view = route[0].route.view;

  return { hostname, mode, view };
}
