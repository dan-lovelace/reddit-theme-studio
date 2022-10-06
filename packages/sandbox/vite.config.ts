import path from "path";

import { defineConfig } from "vite";

const dest = path.join(__dirname, "..", "..", "dist");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: dest,
    rollupOptions: {
      input: "sandbox.html",
    },
  },
});
