import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "../../client/assets/rollo",
    minify: true, //
    target: "es2022",

    rollupOptions: {
        external: (id) => {
          // Never treat aliased src imports as external
          //if (id.startsWith("@")) return false;
          return (
            (id.includes("/test/") && !id.includes("/src/")) ||
            id.endsWith(".test.js")
          );
        },
      },
    lib: {
      entry: resolve(__dirname, "index.js"),
      fileName: () => "rollo.js",
      formats: ["es"],
    },
  },
  plugins: [tailwindcss()],
});
