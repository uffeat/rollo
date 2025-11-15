import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "../../client/assets/toast",
    minify: true,
    target: "es2022",
    lib: {
      entry: resolve(__dirname, "index.js"),
      fileName: () => "toast.js",
      formats: ["es"],
    },
  },
});
