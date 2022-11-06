import { browser, getCurrentTheme, MESSAGE_ACTIONS } from "@rju/core";
import { Comments, Listing, TConfig, TSandboxContext } from "@rju/types";

import { sendSandboxMessage, startListeners } from "./message";
import { getJson } from "./routes";

const colorLogo = browser.runtime.getURL("img/reddit_logo_color_128.png");
const whiteLogo = browser.runtime.getURL("img/reddit_logo_white_128.png");
const thumbnails: { [key: string]: string } = [
  "default",
  "nsfw",
  "self",
  "spoiler",
].reduce(
  (acc, val) => ({
    ...acc,
    [val]: browser.runtime.getURL(`img/thumb_${val}.png`),
  }),
  {}
);

const SUBREDDITS = [
  {
    text: "Popular",
    to: "r/popular",
  },
  {
    text: "All",
    to: "r/all",
  },
  {
    text: "Random",
    to: "r/random",
  },
  {
    text: "Users",
    to: "users",
  },
  {
    text: "AskReddit",
    to: "r/askreddit",
  },
  {
    text: "WorldNews",
    to: "r/worldnews",
  },
  {
    text: "Pics",
    to: "r/pics",
  },
  {
    text: "Funny",
    to: "r/funny",
  },
  {
    text: "Movies",
    to: "r/movies",
  },
  {
    text: "Gaming",
    to: "r/gaming",
  },
  {
    text: "News",
    to: "r/news",
  },
  {
    text: "MildlyInteresting",
    to: "r/mildlyinteresting",
  },
  {
    text: "TodayILearned",
    to: "r/todayilearned",
  },
  {
    text: "NotTheOnion",
    to: "r/nottheonion",
  },
  {
    text: "Videos",
    to: "r/videos",
  },
  {
    text: "ExplainLikeImFive",
    to: "r/explainlikeimfive",
  },
  {
    text: "Aww",
    to: "r/aww",
  },
  {
    text: "Jokes",
    to: "r/jokes",
  },
  {
    text: "TIFU",
    to: "r/tifu",
  },
  {
    text: "Music",
    to: "r/music",
  },
  {
    text: "OldSchoolCool",
    to: "r/oldschoolcool",
  },
  {
    text: "IAMA",
    to: "r/iama",
  },
  {
    text: "TwoXChromosomes",
    to: "r/twoxchromosomes",
  },
  {
    text: "LifeProTips",
    to: "r/lifeprotips",
  },
  {
    text: "DataIsBeatiful",
    to: "r/dataisbeautiful",
  },
  {
    text: "ShowerThoughts",
    to: "r/showerthoughts",
  },
  {
    text: "AskScience",
    to: "r/askscience",
  },
  {
    text: "Books",
    to: "r/books",
  },
  {
    text: "Gifs",
    to: "r/gifs",
  },
];

export function getTemplateContext<T>(
  data: T,
  config: TConfig
): TSandboxContext<T> {
  return {
    data,
    logo: {
      color: colorLogo,
      white: whiteLogo,
    },
    subreddits: SUBREDDITS,
    config,
  };
}

export function handleSandboxLoad({
  config,
  initialize,
}: {
  config: TConfig;
  initialize: () => void;
}) {
  return async () => {
    const { view } = config;

    switch (view) {
      case "comments": {
        const json = await getJson(config);
        const commentsData = new Comments().parse(json);
        console.log("commentsData", commentsData);
        const postThumbnail = commentsData.post.data.children[0].data.thumbnail;

        switch (postThumbnail) {
          case "default":
          case "self":
          case "nsfw":
          case "spoiler":
            commentsData.post.data.children[0].data.thumbnail =
              thumbnails[postThumbnail];
        }

        initSandbox(config, commentsData);
        break;
      }

      case "subreddit": {
        const json = await getJson(config, {
          limit: "30",
        });
        const subredditData = new Listing().parse(json);
        console.log("subredditData", subredditData);

        subredditData.data.children.forEach(({ data: { thumbnail } }, idx) => {
          switch (thumbnail) {
            case "default":
            case "self":
            case "nsfw":
            case "spoiler":
              subredditData.data.children[idx].data.thumbnail =
                thumbnails[thumbnail];
          }
        });

        initSandbox(config, subredditData);
        break;
      }
    }

    initialize();
  };
}

export async function initSandbox<T>(config: TConfig, data: T) {
  startListeners(data, config);

  const context = getTemplateContext(data, config);
  const themeToApply = await getCurrentTheme(config);

  sendSandboxMessage({
    context,
    event: {
      action: MESSAGE_ACTIONS.UPDATE_THEME,
      value: themeToApply,
    },
  });
}
