import path from "path";

import react from "@vitejs/plugin-react";
import staticCopy from "rollup-plugin-copy";
import { defineConfig } from "vite";

const dest = path.join(__dirname, "..", "..", "dist");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    staticCopy({
      targets: [{ src: "public/*", dest }],
    }),
  ],
  build: {
    minify: false, // TODO: remove
    assetsDir: "",
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        file: path.join(dest, "content-script.js"),
        dir: undefined,
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
