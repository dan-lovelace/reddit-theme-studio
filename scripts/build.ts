/* eslint-disable no-console */

/*
  # DESCRIPTION

  This script takes a given manifest version (2 or 3) and generates a
  supported `manifest.json` file from the template located in
  `lib/manifest-template.txt`. It first runs `yarn build` then replaces values
  in the template based on the version it receives before writing the resulting
  JSON into the `dist` directory under the file name `manifest.json`.

  # USAGE

  ```sh
  node build.mjs [2 | 3]
  ```

  # WHY

  Chrome currently supports v3 manifest while other browsers do not. We need a
  way to package all supported versions to use when publishing the extension to
  the various extension stores.
*/

import { exec } from "child_process";
import fs from "fs";
import path from "path";

const __dirname = process.cwd();
const MANIFEST_VERSIONS = [2, 3];

function main() {
  const manifestVersion = process.argv[2];

  if (!manifestVersion) {
    console.error("Missing manifest version");
    console.info(`Usage: node build.cjs [${MANIFEST_VERSIONS.join(" | ")}]`);
    process.exit(1);
  }

  if (!MANIFEST_VERSIONS.includes(parseInt(manifestVersion))) {
    console.error("Invalid manifest version");
    console.info(`Must be one of: ${MANIFEST_VERSIONS.join(", ")}`);
    process.exit(1);
  }

  const manifestJson = fs.readFileSync(
    path.join(__dirname, "lib", `manifest-v${manifestVersion}.json`),
    "utf-8"
  );

  const packageJson = fs.readFileSync(
    path.join(__dirname, "package.json"),
    "utf-8"
  );
  const packageVersion = JSON.parse(packageJson).version;
  const json = JSON.parse(manifestJson);

  json.version = packageVersion;
  delete json["$schema"];

  exec("yarn workspaces run build", (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      process.exit(1);
    }

    fs.writeFileSync(
      path.join(__dirname, "dist", "manifest.json"),
      JSON.stringify(json, undefined, 2),
      "utf-8"
    );

    console.log(stdout);
  });
}

main();
