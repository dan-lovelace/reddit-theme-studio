import path from "path";

import { defineConfig } from "vite";

const dest = path.join(__dirname, "..", "..", "dist");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    assetsDir: "",
    rollupOptions: {
      input: "src/index.ts",
      minify: mode === "production",
      output: {
        file: path.join(dest, "background.js"),
        dir: undefined,
        assetFileNames: "[name].[ext]",
      },
    },
  },
}));
