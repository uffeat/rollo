import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import path from "node:path";
import { fileURLToPath } from "url";
import inject from "@rollup/plugin-inject";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

/* Create __dirname to help aliases work reliably */
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    /* Set base URL (accessible from code as import.meta.env.BASE_URL) */
    base: "/",
    define: {
      /* Enable use of import.meta.env.VERCEL_ENV */
      "import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
      /* Enable use of import.meta.env.VERCEL_URL */
      "import.meta.env.VERCEL_URL": JSON.stringify(process.env.VERCEL_URL),
    },
    build: {
      minify: false, //
      manifest: true,
      target: "es2022",
      rollupOptions: {
        external: (id) => {
          // Never treat aliased src imports as external
          if (id.startsWith("@")) return false;

          return (
            (id.includes("/assets/") && !id.includes("/src/")) ||
            (id.includes("/parcels/") && !id.includes("/src/")) ||
            (id.includes("/templates/") && !id.includes("/src/")) ||
            (id.includes("/test/") && !id.includes("/src/")) ||
            id.endsWith(".test.js")
          );
        },
      },
    },

    server: {
      port: 3869,
    },

    plugins: [
      /* Enable Temporal without the need to go: 
        import { Temporal } from '@js-temporal/polyfill';
      in the app. */
      inject({
        Temporal: ["@js-temporal/polyfill", "Temporal"],
      }),
      tailwindcss(),
      react(),
    ],

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        // Alt: "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
