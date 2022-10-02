import type { TConfig, TMode } from "@rju/types";

export function getConfig(): TConfig {
  const {
    location: { hostname },
  } = window;
  const mode: TMode = hostname === "old.reddit.com" ? "legacy" : "redesign";

  return { hostname, mode };
}
