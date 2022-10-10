/**
 * App configuration
 */
export type TConfig = {
  /**
   * @example old.reddit.com
   */
  hostname: string;

  /**
   * @example legacy
   */
  mode: TMode;

  /**
   * @example subreddit
   */
  view: TView;
};

export type TMessageAction = "update-style" | "update-template";

/**
 * Window message event
 * @example
 * {
 *   action: "update-style",
 *   value: "<div>{{logo.white}}</div>"
 * }
 */
export type TMessageEvent<T> = {
  action: TMessageAction;
  value: T | string;
};

export type TMode = "legacy" | "redesign";

export type TSandboxContext<T> = {
  config: TConfig;
  data: T;
  logo: {
    white: string;
  };
  subreddits: {
    text: string;
    to: string;
  }[];
};

export type TSandboxMessageEvent = {
  partials: TSandboxPartial[];
  template: TSandboxTemplate;
};

export type TSandboxMessage<T> = {
  context?: TSandboxContext<T>;
  event: TMessageEvent<TSandboxMessageEvent>;
};

export type TSandboxPartial = {
  name: string;
  template: TSandboxTemplate;
};

export type TSandboxTemplate = string;

export type TStorageItem = {
  value: string;
  view: TView;
};

export type TView = "comments" | "subreddit";

export type TViewInputValue = {
  template: string;
  partials: {
    label: string;
    name: string;
    template: string;
  }[];
};
