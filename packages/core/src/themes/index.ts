import { browser, STORAGE_KEYS } from "@rju/core";
import { TConfig, TTheme } from "@rju/types";

import hackerNews from "./hackerNews";

const { CURRENT_THEME, CUSTOM_THEMES } = STORAGE_KEYS;

const helpTheme: TTheme = {
  id: "help",
  label: "Help",
  type: "premade",
  inputs: {
    comments: {
      partials: [],
      template: `<div>Error: No template found for view 'comments'. Use the editor to create one.</div>`,
    },
    style: "",
    subreddit: {
      partials: [],
      template: `<div>Error: No template found for view 'subreddit'. Use the editor to create one.</div>`,
    },
  },
};

export const premadeThemes = [hackerNews];

export function applyTheme(theme: TTheme) {
  browser.storage.sync.set({
    [CURRENT_THEME]: {
      id: theme.id,
      type: theme.type,
    },
  });
}

export async function getCurrentTheme(config: TConfig) {
  const storedCurrentTheme = await browser.storage.sync.get(CURRENT_THEME);
  const currentTheme: TTheme = storedCurrentTheme[CURRENT_THEME];

  if (!currentTheme) {
    return null;
  }

  let returnTheme = helpTheme;

  switch (currentTheme.type) {
    case "custom": {
      // load from storage
      const storedCustomThemes = await browser.storage.sync.get(CUSTOM_THEMES);
      const customThemes: TTheme[] = storedCustomThemes[CUSTOM_THEMES];

      if (customThemes && customThemes.length) {
        const customTheme = customThemes.find((t) => t.id === currentTheme.id);

        if (customTheme && customTheme.inputs[config.view].template) {
          returnTheme = customTheme;
        }
      }
      break;
    }

    case "premade": {
      // load from premade themes
      const premadeTheme = premadeThemes.find((t) => t.id === currentTheme.id);

      if (premadeTheme && premadeTheme.inputs[config.view].template) {
        returnTheme = premadeTheme;
      }
      break;
    }

    default:
      throw new Error("Unknown current theme type");
  }

  return returnTheme;
}
