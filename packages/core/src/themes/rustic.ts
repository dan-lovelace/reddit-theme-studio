import { TTheme } from "@rju/types";

const theme: TTheme = {
  id: "rustic",
  label: "Rustic",
  type: "premade",
  inputs: {
    comments: {
      partials: [
        {
          label: "Comments partial",
          name: "comments",
          template: `
{{#each children}}
  <div class="comments-partial">
    {{#if data.author}}
      <details class="comments-partial__details" open>
        <summary id="{{data.created_utc}}">
          <a href="/user/{{data.author}}">
            {{data.author}}
          </a>
          {{data.ups}} points
          {{prettyDate data.created_utc}}
        </summary>
        <div class="comments-partial__body">
          {{{inject data.body_html}}}
        </div>
        {{#with data.replies.data}}
          <div class="comments-partial__children">
            {{> comments}}
          </div>
        {{/with}}
      </details>
    {{else}}
      <a href="{{data.id}}">
        more replies...
      </a>
    {{/if}}
  </div>
{{/each}}
      `,
        },
      ],
      template: `
<div class="page-layout">
  <header class="page-header">
    <div class="page-header__logo">
      <a href="/">
        <img src={{logo.color}} />
        Reddit
      </a>
    </div>
    {{#each subreddits}}
      <div class="page-header__subreddit">
        <a
          class="page-header__subreddit__link"
          href="//{{../config.hostname}}/{{this.to}}"
        >
          {{this.text}}
        </a>
        {{#ifnotend @index ../subreddits.length}}
          <span class="page-header__subreddit__separator">
            |
          </span>
        {{/ifnotend}}
      </div>
    {{/each}}
  </header>
  <div class="page-layout__body">
    <div class="post-layout">
      {{#with data.post.data.children.0.data}}
        <div class="post-result__container">
          <div class="post-result__points">
            {{ups}}
          </div>
          <div>
            <div class="post-layout__title">
              <a href="{{permalink}}">
                {{{title}}}
              </a>
            </div>
            <div class="post-result__meta">
              submitted
              {{prettyDate created_utc}}
              by
              <a href="/user/{{author}}">
                {{author}}
              </a>
              <div>
                <a href="{{this.data.permalink}}">
                  {{num_comments}}
                  comments
                </a>
              </div>
            </div>
            <div class="comments-post__preview">
              {{#if media.reddit_video.fallback_url}}
                <video
                  autoplay
                  controls
                  muted
                  src="{{media.reddit_video.fallback_url}}"
                ></video>
              {{else}}
                {{#if preview.images.0.source.url}}
                  <a href="{{url}}">
                    <img src="{{{preview.images.0.source.url}}}" />
                  </a>
                {{/if}}
              {{/if}}
            </div>
          </div>
        </div>
      {{/with}}
    </div>
    <div class="comments-layout">
      {{#with data.comments.data}}
        <div class="comments-layout__container">
          {{> comments}}
        </div>
      {{/with}}
    </div>
  </div>
</div>
      `,
    },
    style: `
blockquote {
  margin: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid lightgrey;
  border-left: 0.25rem solid lightgrey;
}

button {
  border: 1px solid lightgrey;
  margin-right: 0.25rem;
}

.page-layout {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: grey;
  padding: 1rem;
}

.page-layout a {
  color: black;
}

.page-header {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 1rem;
}

.page-header__logo a {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-weight: bold;
}

.page-header__logo img {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}

.page-header__subreddit {
  display: flex;
  text-transform: lowercase;
}

.page-header__subreddit__separator {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.post-list__list {
  list-style: auto;
  margin-left: 2rem;
}

.post-result__title a {
  color: blue;
}

.post-result__title a:visited {
  color: purple;
}

.post-result {
  margin-bottom: 1rem;
}

.post-result__container {
  display: flex;
}

.post-result__meta {
  font-size: 0.75rem;
}

.post-result__points {
  min-width: 4.25rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.post-result__thumbnail {
  min-width: 70px;
  height: 50px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 0.5rem;
}

.comments-layout__container > .comments-partial {
  border: 1px solid lightgrey;
  background-color: #FAF9F6;
  padding: 0.25rem;
}

.comments-partial {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.comments-partial__body {
  color: #000000;
  margin-bottom: 1rem;
  margin-left: 1.15rem;
  font-size: 1rem;
}

.comments-partial__body a {
  color: blue;
}

.comments-partial__body p {
  margin: 0.5rem 0;
}

.comments-partial__children {
  margin-left: 1.15rem;
}

.comments-partial__details summary {
  cursor: pointer;
  display: inline;
  pointer-events: none;
}

.comments-partial__details summary * {
  pointer-events: auto;
}

.comments-partial__details > summary:before {
  content: "[+]";
  pointer-events: auto;
}

.comments-partial__details[open] > summary:before {
  content: "[-]";
  pointer-events: auto;
}

.comments-partial__details summary p {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.comments-post__preview {
  margin: 1rem 0;
}

.comments-post__preview img, video {
  width: 100%;
  max-width: 440px;
}
    `,
    subreddit: {
      partials: [],
      template: `
<div class="page-layout">
  <header class="page-header">
    <div class="page-header__logo">
      <a href="/">
        <img src={{logo.color}} />
        Reddit
      </a>
    </div>
    {{#each subreddits}}
      <div class="page-header__subreddit">
        <a
          class="page-header__subreddit__link"
          href="//{{../config.hostname}}/{{this.to}}"
        >
          {{this.text}}
        </a>
        {{#ifnotend @index ../subreddits.length}}
          <span class="page-header__subreddit__separator">
            |
          </span>
        {{/ifnotend}}
      </div>
    {{/each}}
  </header>
  <div class="page-layout__body">
    <div class="post-list">
      <ol class="post-list__list" start="{{add (times data.data.limit data.data.page) 1}}">
        {{#each data.data.children}}
          <li class="post-result">
            <div class="post-result__container">
              <div class="post-result__points">
                {{this.data.ups}}
              </div>
              {{#if this.data.thumbnail}}
                <a href="{{this.data.url}}">
                  <div
                    class="post-result__thumbnail"
                    style="background-image: url({{this.data.thumbnail}})"
                  ></div>
                </a>
              {{/if}}
              <div>
                <span class="post-result__title">
                  <a href="{{this.data.url}}">
                    {{{this.data.title}}}
                  </a>
                </span>
                <div class="post-result__meta">
                  submitted
                  {{prettyDate this.data.created_utc}}
                  by
                  <a href="/user/{{this.data.author}}">
                    {{this.data.author}}
                  </a>
                  to
                  <a href="/r/{{this.data.subreddit}}">                  
                    r/{{this.data.subreddit}}
                  </a>
                  <div>
                    <a href="{{this.data.permalink}}">
                      {{this.data.num_comments}}
                      comments
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        {{/each}}
      </ol>
    </div>
  </div>
  <footer>
    {{#if data.data.before}}
      <a href="{{data.data.prevUrl}}">
        <button>
          ‹ prev
        </button>
      </a>
    {{/if}}
    {{#if data.data.after}}
      <a href="{{data.data.nextUrl}}">
        <button>
          next ›
        </button>
      </a>
    {{/if}}
  </footer>
</div>
      `,
    },
  },
};

export default theme;
