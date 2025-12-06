import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "../../client/assets/blog",
    minify: true,
    target: "es2022",
    lib: {
      entry: resolve(__dirname, "index.js"),
      fileName: () => "blog.js",
      formats: ["es"],
    },
  },
  plugins: [tailwindcss()],
});
