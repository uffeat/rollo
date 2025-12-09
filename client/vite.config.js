import { defineConfig } from "vite";
import { resolve, dirname } from "path";
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
        external: (path) =>
          (path.includes("/assets/") && !path.includes("/src/")) ||
          (path.includes("/parcels/") && !path.includes("/src/")) ||
          (path.includes("/templates/") && !path.includes("/src/")) ||
          (path.includes("/test/") && !path.includes("/src/")) ||
          path.endsWith(".test.js"),
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
        "component": resolve(__dirname, "src/component/component.js"),
      },
    },
  };
});
