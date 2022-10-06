export const listingTypes: { [key in TListingType]: string } = {
  t1: "comment",
  t2: "account",
  t3: "link",
  t4: "message",
  t5: "subreddit",
  t6: "award",
};
export const modes = ["legacy", "redesign"] as const;
export const views = ["comments", "subreddit"] as const;

export interface IParsable<T> {
  parse(json: any): T;
}

export type TConfig = {
  hostname: string;
  mode: TMode;
};
export type TListingType = "t1" | "t2" | "t3" | "t4" | "t5" | "t6";
export type TMode = typeof modes[number];
export type TView = typeof views[number];

export * from "./listing";
