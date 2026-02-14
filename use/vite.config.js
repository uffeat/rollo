import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import inject from "@rollup/plugin-inject";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "../client/src",
    minify: true,
    target: "es2022",
    rollupOptions: {
      /* Probably not necessary to define external */
      external: (id) => {
        return (
          (id.includes("/test/") && !id.includes("/src/")) ||
          id.endsWith(".test.js")
        );
      },
    },
    lib: {
      entry: resolve(__dirname, "index.js"),
      fileName: () => "use.js",
      formats: ["es"],
    },
  },
  plugins: [
    inject({
      Temporal: ["@js-temporal/polyfill", "Temporal"],
    }),
    tailwindcss(),
  ],
});
