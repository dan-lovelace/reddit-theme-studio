import path from "path";

import { defineConfig } from "vite";

const dest = path.join(__dirname, "..", "..", "dist");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: "",
    rollupOptions: {
      input: "src/index.ts",
      output: {
        file: path.join(dest, "background.js"),
        dir: undefined,
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
