import { TMessageAction } from "@rju/types";

export const MESSAGE_ACTIONS: { [key: string]: TMessageAction } = Object.freeze(
  {
    UPDATE_STYLE: "update-style",
    UPDATE_TEMPLATE: "update-template",
  }
);
