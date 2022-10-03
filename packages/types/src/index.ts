export const MODES = ["legacy", "redesign"] as const;

export type TMode = typeof MODES[number];

export type TChild = {
  /**
   * Data associated with a single child node
   */
  data: {
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
     * Post pathname
     *
     * @example
     * /r/AskReddit/comments/xsnsva/who_is_the_most_evil_person_who_is_still_alive/
     */
    permalink: string;

    /**
     * Post preview assets
     *
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
     *
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
     * Post thumbnail
     *
     * @example
     * https://b.thumbs.redditmedia.com/rSCwDugbjFlSdHfd03y4Tx0fqGPwEXclICMayot4jGk.jpg
     */
    thumbnail: string; // default, self, nsfw

    /**
     * Post title
     *
     * @example
     * Who is the most evil person who is still alive?
     */
    title: string;

    /**
     * Number of upvotes
     */
    ups: number;

    /**
     * Post URL
     *
     * @example
     * https://old.reddit.com/r/AskReddit/comments/xsnsva/who_is_the_most_evil_person_who_is_still_alive/
     */
    url: string;
  };
};

export type TConfig = {
  hostname: string;
  mode: TMode;
};

export type TPageData = {
  children: TChild[];
};
