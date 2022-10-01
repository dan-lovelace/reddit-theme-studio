import { TConfig } from "@rju/types";

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
