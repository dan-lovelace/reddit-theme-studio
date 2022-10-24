import type { TView } from "@rju/types";

const CURRENT_TEMPLATE: { [key in TView]: string } = {
  comments: "current-comments-template",
  subreddit: "current-subreddit-template",
};

export const STORAGE_KEYS = Object.freeze({
  CURRENT_STYLE: "current-style",
  CURRENT_TEMPLATE,
  SAVED_THEMES: "saved-themes",
  SELECTED_TAB: "selected-tab",
  SELECTED_VIEW: "selected-view",
});
