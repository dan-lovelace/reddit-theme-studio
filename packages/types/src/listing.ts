import { z } from "zod";

import { IParsable } from ".";

export type TListing = {
  data: TListingData;
};

export type TListingData = {
  /**
   * Hash to the next page
   */
  after: string | null;

  /**
   * Hash to the previous page
   */
  before: string | null;

  /**
   * Listing results
   */
  children: TListingDataChild[];

  /**
   * Number of listing results
   */
  dist: number | null;
};

export type TListingDataChild = {
  kind: string;
  data: TListingDataChildData;
};

export type TListingDataChildData = {
  /**
   * Post author username
   *
   * @example
   * naughtynelly
   */
  author: string;

  /**
   * Post creation time
   *
   * @example
   * 1664604641
   */
  created_utc: number;

  /**
   * Number of downvotes
   */
  downs: number;

  /**
   * Number of comments
   */
  num_comments: number;

  /**
   * Pathname
   * @example
   * /r/AskReddit/comments/xsnsva/who_is_the_most_evil_person_who_is_still_alive/
   */
  permalink: string;

  /**
   * Post preview assets
   * @example
   * images: [
   *   {
   *     source: {
   *       url: "https://external-preview.redd.it/CkrIxbewCTfOk-Z2TbBCkP4MYGF0h5ncZkZQs2svKOY.png?format=pjpg&amp;auto=webp&amp;s=33828afbfbc3af01012fec6daf9666c40eb42b7f"
   *     }
   *   }
   * ]
   */
  preview?: {
    images: {
      source: {
        url: string;
      };
    }[];
  };

  /**
   * Subreddit name
   * @example
   * AskReddit
   */
  subreddit: string;

  /**
   * Prefixed subreddit name
   *
   * @example
   * r/AskReddit
   */
  subreddit_name_prefixed: string;

  /**
   * Thumbnail source or type
   * @example
   * https://b.thumbs.redditmedia.com/rSCwDugbjFlSdHfd03y4Tx0fqGPwEXclICMayot4jGk.jpg
   * self
   * nsfw
   */
  thumbnail: string;

  /**
   * Title
   * @example
   * Who is the most evil person who is still alive?
   */
  title: string;

  /**
   * Number of upvotes
   */
  ups: number;

  /**
   * Full URL
   * @example
   * https://old.reddit.com/r/AskReddit/comments/xsnsva/who_is_the_most_evil_person_who_is_still_alive/
   */
  url: string;
};

export class Listing implements IParsable<TListing> {
  parse(json: any): TListing {
    const shape = z.object({
      kind: z.string(),
      data: z.object({
        after: z.string().or(z.null()),
        before: z.string().or(z.null()),
        children: z.array(
          z.object({
            kind: z.string(),
            data: z.object({
              author: z.string(),
              created_utc: z.number(),
              downs: z.number(),
              num_comments: z.number(),
              permalink: z.string(),
              preview: z
                .object({
                  images: z.array(
                    z.object({
                      source: z.object({
                        url: z.string(),
                      }),
                    })
                  ),
                })
                .optional(),
              subreddit: z.string(),
              subreddit_name_prefixed: z.string(),
              thumbnail: z.string(),
              title: z.string(),
              ups: z.number(),
              url: z.string(),
            }),
          })
        ),
        dist: z.number().or(z.null()),
      }),
    });

    return shape.parse(json);
  }
}
