import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import path from "node:path";
import { fileURLToPath } from "url";
import inject from "@rollup/plugin-inject";
import tailwindcss from "@tailwindcss/vite";

/* Create __dirname to help aliases work reliably */
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    /* Set base URL (accessible from code as import.meta.env.BASE_URL) */
    base: "/",
    build: {
      target: "es2022",
    },
    server: {
      port: 8069,
    },

    plugins: [
      
      inject({
        Temporal: ["@js-temporal/polyfill", "Temporal"],
      }),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        // Alt: "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
