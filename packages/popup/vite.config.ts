import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dest = path.join(__dirname, "..", "..", "dist");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    minify: mode === "production",
    outDir: dest,
    rollupOptions: {
      input: "popup.html",
    },
  },
}));
