# Reddit JSON UI

A browser extension that stylizes Reddit pages by fetching their associated JSON
(if available) and wrapping the page in a fully-customized style you provide.

⚠️ This is still very much a work in progress. It is not yet available on any
extension store but may be installed locally by following the "Local
Development" section below. The API may change at any time so it's a good idea
to keep backups of your templates and styles.

|                        Theme                        |                Editor                 |
| :-------------------------------------------------: | :-----------------------------------: |
| ![HackerNews](lib/screenshots/hackernews-theme.png) | ![Editor](lib/screenshots/editor.png) |

## What?

Reddit offers a public JSON API that is accessible by appending `.json` to the
end of a lot of URLs. Check out an example:
https://old.reddit.com/r/popular.json. The extension works by fetching the
current page's JSON and applying your own HTML and CSS to provide a customized
user experience.

# Creating your first theme

When you first load Reddit without a template for the given page, you may see a
"No template found" error. The following guide will help you create one.

We'll start with the Subreddit view then work our way into Comments. Click the
extension's icon in your browser to open the editor. You'll see two tabs: HTML
and CSS. Change views by switching the View dropdown on the HTML tab. Don't
worry about the CSS tab quite yet, we'll get there after adding some HTML.

HTML is compiled using a templating language called
[Handlebars](https://handlebarsjs.com/). This guide will show you the basics but
feel free to check out their documentation for more info. Let's get to it.

## Subreddit view

First, navigate to the Reddit homepage (https://reddit.com or
https://old.reddit.com) or any subreddit. With the Subreddit view selected on
the HTML tab, paste the following content into the text editor then click Apply.

```hbs
<div class="page-layout">
  <header class="page-header">
    Reddit
    {{#each subreddits}}
      <a
        class="subreddit"
        href="//{{../config.hostname}}/{{this.to}}"
      >
        {{this.text}}
      </a>
    {{/each}}
  </header>
  <ol class="post-list">
    {{#each data.data.children}}
      <li class="post-result">
        <a
          class="post-result__title"
          href="{{this.data.permalink}}"
        >
          {{{this.data.title}}}
        </a>
        <div class="post-result__meta">
          {{this.data.ups}}
          points by
          <a href="/user/{{this.data.author}}">
            {{this.data.author}}
          </a>
          {{prettyDate this.data.created_utc}}
          |
          <a href="{{this.data.permalink}}">
            {{this.data.num_comments}}
            comments
          </a>
        </div>
      </li>
    {{/each}}
  </ol>
</div>
```

You should see a very basic page with a header and list of posts. It's not very
pretty yet, let's add some styles.

## Styles

Select the CSS tab, paste in the following content then click Apply.

```css
.page-layout {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: orange;
  color: black;
  overflow: hidden;
}

.page-header img {
  width: 24px;
  height: 24px;
  margin-right: 3px;
}

.page-header .subreddit {
  margin: 0 3px;
}

.post-list {
  background-color: lightGray;
  padding: 1rem;
}

.post-result {
  margin-bottom: 0.5rem;
}
```

That's looking better! If you click into a post at this point to see its
comments, you'll see another "No template found" error. Let's remedy that.

## Comments - Layout

Click into any post title to navigate to its comments page. Select the Comments
view on the HTML tab and paste the following content into the Layout field.

```hbs
<div class="page-layout">
  <header class="page-header">
    Reddit
    {{#each subreddits}}
      <a
        class="subreddit"
        href="//{{../config.hostname}}/{{this.to}}"
      >
        {{this.text}}
      </a>
    {{/each}}
  </header>
  <div class="page-layout__body">
    <div class="post-list">
      {{#with data.post.data.children.0.data}}
        <div class="post-layout__title">
          {{{title}}}
        </div>
        {{#if thumbnail}}
          <div class="post-result__thumbnail">
            <a href="{{url}}">
              <img src="{{thumbnail}}" />
            </a>
          </div>
        {{/if}}
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
```

## Comments - Partial

With your Comments layout in place, paste the following into the Partial input
then click Apply.

```hbs
{{#each children}}
  <div class="comments-partial">
    {{#if data.author}}
      <div class="comments-partial__title">
        • {{data.author}} {{prettyDate data.created_utc}}
      </div>
    {{/if}}
    <div class="comments-partial__body">
      {{{data.body}}}
    </div>
    {{#with data.replies.data}}
      <div class="comments-partial__children">
        {{> comments}}
      </div>
    {{/with}}
  </div>
{{/each}}
```

Alright, now we have some comments on the page. Time to give them some style.

## Comments - Style

Select the CSS tab again and paste the following onto the end of the existing
styles and apply.

```css
.comments-layout {
  background-color: lightGray;
}

.comments-partial {
  padding: 0 1rem;
}

.comments-partial__body {
  margin: 0 0 0.4rem 0.6rem;
}

.comments-partial__children {
  margin-left: 2rem;
}
```

You've successfully built your first theme! We've kept things very basic for
this guide but there are lots of options available. Review the Template API docs
below or check out a complete theme based on
[HackerNews](https://news.ycombinator.com/) in the `templates` directory.

# Template API

A number of data are available in the templates themselves and more will be
added as the extension is built out. Refer to the `types` package for more
details.

## `config`

The current page's configuration

- `hostname` - The page's hostname such as `reddit.com` or `old.reddit.com`.
- `mode` - The user's view mode. Can be `legacy` or `redesign`. The HTML root
  element is assigned a class name with the mode so you can split styles between
  each.
- `view` - The page currently displayed. Only supports `comments` and
  `subreddit` for now.

## `data`

Data currently loaded from the JSON API. Varies between view.

### Subreddit

- `after` - Hash to the next page
- `before` - Hash to the previous page
- `children` - A list of post objects
- `children[i].data` - Data associated with the given post
- `children[i].data.author` - Post author
- `children[i].data.created_utc` - Post creation time in UTC format
- `children[i].data.downs` - Number of downvotes
- `children[i].data.num_comments` - Number of comments
- `children[i].data.permalink` - Post pathname
- `children[i].data.subreddit` - Post's subreddit name
- `children[i].data.thumbnail` - Image thumbnail source
- `children[i].data.title` - Post title
- `children[i].data.ups` - Number of upvotes
- `children[i].data.url` - Post URL
- `dist` - The number of posts returned

### Comments

- `after` - Hash to the next page
- `before` - Hash to the previous page
- `children` - A list of comment objects
- `children[i].data` - Data associated with the given comment
- `children[i].data.author` - Comment author
- `children[i].data.body` - Comment body
- `children[i].data.created_utc` - Comment creation time in UTC format
- `children[i].data.replies` - Comment replies that take the same shape as
  comments
- `dist` - The number of comments

## `logo`

Logo variations

- `white` - Flat white logo. Only supported option right now.

## `subreddits`

A list of subreddit objects with the following properties

- `to` - Subreddit URL
- `text` - Subreddit name

## Handlebars helpers

- `capitalize` - Capitalizes the first letter of a string
  - Usage: `{{capitalize title}}`
- `ifnotend` - Determines whether a given index is at the end of a list. Helpful
  for inserting dividers between elements.
  - Usage: `{{#ifnotend @index subreddits.length}}|{{/ifnotend}}`
- `prettyDate` - Converts a UTC date to humanized form (i.e. `6 hours ago`)
  - Usage: `{{prettyDate created_utc}}`
- `truncate` - Shortens a given string with ellipsis
  - Usage: `{{truncate url}}`

# Local Development

## Requirements

| Name                                                   | Version  |
| ------------------------------------------------------ | -------- |
| [NodeJS](https://nodejs.org/en/blog/release/v16.16.0/) | v16      |
| [Yarn](https://yarnpkg.com/)                           | v1.22.19 |

## 1. Install

```shell
$ git clone https://github.com/dan-lovelace/reddit-json-ui.git
$ cd reddit-json-ui
$ yarn
```

## 2. Build

Once complete, build assets can be located in the `dist` directory at the
project root. Keep this in mind when adding the unpacked version to your browser
for testing.

### Build commands

| Command        | Description                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| `yarn start`   | Creates a Manifest V3 build and starts file watchers on all packages<sup>+</sup> |
| `yarn build 2` | Creates a build using Manifest V2                                                |
| `yarn build 3` | Creates a build using Manifest V3                                                |

<sup>+</sup> If you'd instead like to develop using V2, you'll need to copy the
contents of `lib/manifest-v2.json` into `packages/content/public/manifest.json`
and run a clean build.

## 3. Add browser extension

After starting or building, the extension's distribution is located in the
`dist` directory at the root of the project. Add the unpacked assets to your
browser of choice. For now, Manifest V3 builds are only supported by Chrome.

Chrome: https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked

Firefox:
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing
