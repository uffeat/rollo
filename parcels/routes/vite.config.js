import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "../../client/public/parcels/routes",
    minify: true, //
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
      fileName: () => "routes.js",
      formats: ["es"],
    },
  },
  plugins: [tailwindcss()],
});
