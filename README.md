# Reddit JSON UI

A lightweight browser extension that stylizes Reddit pages by fetching their
associated JSON (if available) and wrapping the page in a style you provide.

## What?

Reddit offers a public JSON API that is accessible by appending `.json` to the
end of a lot of URLs. Check out an example:
https://old.reddit.com/r/popular.json.

# Local Development

## Requirements

| Name                                                   | Version  |
| ------------------------------------------------------ | -------- |
| [NodeJS](https://nodejs.org/en/blog/release/v16.16.0/) | v16      |
| [Yarn](https://yarnpkg.com/)                           | v1.22.19 |

## 1. Install

```shell
$ git clone https://github.com/dan-lovelace/reddit-json-ui.git
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
