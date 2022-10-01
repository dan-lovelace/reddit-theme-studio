import { TConfig } from "@rju/types";

export function getConfig(): TConfig {
  const {
    location: { hostname },
  } = window;

  return { hostname };
}
