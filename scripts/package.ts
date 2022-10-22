/* eslint-disable no-console */
import { exec } from "child_process";
import fs from "fs";
import path from "path";

import archiver from "archiver";

const __dirname = process.cwd();

function main() {
  const manifestVersion = process.argv[2];

  exec(`yarn build ${manifestVersion}`, (execError, stdout, stderr) => {
    if (execError) {
      console.log(stderr);
      process.exit(1);
    }

    const packageJson = fs.readFileSync("package.json", "utf-8");
    const packageVersion = JSON.parse(packageJson).version;
    const output = fs.createWriteStream(
      path.join(__dirname, "versions", `${packageVersion}.zip`)
    );
    const archive = archiver("zip", {
      zlib: {
        level: 9,
      },
    });

    archive.on("error", (archiveError) => {
      throw archiveError;
    });

    archive.pipe(output);
    archive.directory("dist/", false);
    archive.finalize();

    output.on("close", () => {
      console.log(stdout);
    });
  });
}

main();
