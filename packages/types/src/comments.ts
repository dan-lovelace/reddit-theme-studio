import { z } from "zod";

import { IParsable, Listing, TListing } from ".";

export type TComments = {
  kind: string;
  data: TCommentsData;
};

export type TCommentsData = {
  /**
   * Hash to the next item
   */
  after: string | null;

  /**
   * Hash to the previous item
   */
  before: string | null;

  /**
   * List of comments
   */
  children: TCommentsDataChild[] | string;

  /**
   * Number of listing results
   */
  dist: number | null;
};

export type TCommentsDataChild = {
  kind: string;
  data: TCommentsDataChildData;
};

export type TCommentsDataChildData = {
  body?: string;
  replies?: TCommentReplies | string;
  subreddit_id?: string;
};

export type TCommentReplies = {
  kind: string;
  data: TCommentsData;
};

const CommentReply: z.ZodType<TCommentsDataChildData> = z.lazy(() =>
  z.object({
    body: z.string().optional(),
    replies: z.union([CommentReplies, z.string()]),
    subreddit_id: z.string().optional(),
  })
);

const CommentReplies: z.ZodType<TCommentReplies | string | undefined> = z.lazy(
  () =>
    z
      .object({
        kind: z.string(),
        data: z.object({
          after: z.string().or(z.null()),
          before: z.string().or(z.null()),
          children: z.array(
            z.object({
              kind: z.string(),
              data: CommentReply,
            })
          ),
          dist: z.number().or(z.null()),
        }),
      })
      .or(z.string())
      .optional()
);

export class Comments implements IParsable<TListing, TComments> {
  parse(json: any): [TListing, TComments] {
    if (json.length < 2) {
      throw new Error("Invalid comments json");
    }

    const subreddit = new Listing().parse(json[0]);
    const shape = z.object({
      kind: z.string(),
      data: z.object({
        after: z.string().or(z.null()),
        before: z.string().or(z.null()),
        children: z.array(
          z.object({
            kind: z.string(),
            data: CommentReply,
          })
        ),
        dist: z.number().or(z.null()),
      }),
    });

    return [subreddit, shape.parse(json[1])];
  }
}
