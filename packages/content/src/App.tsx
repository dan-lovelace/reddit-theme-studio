import { useEffect } from "react";

import { browser, STORAGE_KEYS } from "@rju/core";
import { Listing, TConfig } from "@rju/types";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { update } from "./app/slices/pageData";
import { LINKS } from "./components/Header/Header";
import PageLayout from "./containers/PageLayout";
import { getJsonPath, ROUTES } from "./lib/routes";

type AppProps = {
  config: TConfig;
};

const router = createBrowserRouter(ROUTES);
const logo = browser.runtime.getURL("reddit_logo_32.png");

export default function App({ config }: AppProps) {
  const { data } = useAppSelector((state) => state.pageData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function init() {
      const jsonLocation = getJsonPath(config);
      const result = await fetch(jsonLocation, {
        headers: {
          "Cache-Control": "max-age=300",
        },
      });
      const json = await result.json();
      console.log("json", json);

      const listing = new Listing();
      const parsed = listing.parse(json);
      console.log("parsed", parsed);

      window.addEventListener("message", (event) => {
        console.log("content message", event);
        const root = document.getElementById("rju-root");

        if (root) {
          root.innerHTML = event.data.result;
        }
      });

      dispatch(update(parsed));

      const template = await browser.storage.sync.get(
        STORAGE_KEYS.CURRENT_TEMPLATE.subreddit
      );

      if (
        Object.prototype.hasOwnProperty.call(
          template,
          STORAGE_KEYS.CURRENT_TEMPLATE.subreddit
        )
      ) {
        const sandbox = document.getElementById(
          "rju-sandbox"
        ) as HTMLIFrameElement;
        sandbox.contentWindow?.postMessage(
          {
            template: template[STORAGE_KEYS.CURRENT_TEMPLATE.subreddit],
            context: { data: parsed.data, logo, subreddits: LINKS, ...config },
          },
          "*"
        );
      }
    }

    init();
  }, []);

  const handleClick = () => {
    const sandbox = document.getElementById("rju-sandbox") as HTMLIFrameElement;

    sandbox.contentWindow?.postMessage(
      {
        template: String(`<div class="page-layout">
        <header class="page-header">
          <div class="page-header__logo">
            <a href="/">
              <img src={{logo}} />
              Reddit
            </a>
          </div>
          {{#each subreddits}}
            <div class="page-header__subreddit">
              <a class="page-header__subreddit_link" href="https://{{../hostname}}/{{this.to}}">
                {{this.text}}
              </a>
              {{#ifnotend @index ../subreddits.length}}
                <span class="page-header__subreddit_separator">|</span>
              {{/ifnotend}}
            </div>
          {{/each}}
        </header>
        <div class="page-layout__body">
          <div class="post-list">
            <ol class="post-list__list">
              {{#each data.children}}
                <li class="post-result">
                  <span class="post-result__title">
                    <a href="{{this.data.permalink}}">{{this.data.title}}</a>
                  </span>
                  <span class="post-result__url">
                    (<a href="{{this.data.url}}">{{this.data.url}}</a>)
                  </span>
                  <div class="post-result__meta">
                    {{this.data.ups}}
                    points by
                    <a href="/user/{{this.data.author}}">{{this.data.author}}</a>
                    {{this.data.created_utc}}
                    |
                    <a href="{{this.data.permalink}}">{{this.data.num_comments}}
                      comments</a>
                  </div>
                </li>
              {{/each}}
            </ol>
          </div>
        </div>
      </div>`),
        context: { data, logo, subreddits: LINKS, ...config },
      },
      "*"
    );
  };

  return (
    <PageLayout>
      <button onClick={handleClick}>Compile template</button>
      <RouterProvider router={router} />
    </PageLayout>
  );
}
