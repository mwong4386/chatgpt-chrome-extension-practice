import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

const src = resolve(__dirname, "src");
const dist = resolve(__dirname, "dist");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: resolve(src, "assets"),
  build: {
    outDir: dist,
    rollupOptions: {
      input: {
        background: resolve(src, "background/index.tsx"),
        contentScript: resolve(src, "contentScript/index.tsx"),
        popup: resolve(src, "popup/index.html"),
      },
      output: {
        entryFileNames: "src/[name]/index.js",
      },
    },
  },
});
