import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import inject from "@rollup/plugin-inject";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    /* Set base URL for dev and production (accessible from code as import.meta.env.BASE_URL) */
    base: mode === "production" ? "./" : "/",
    define: {
      /* Enable use of import.meta.env.VERCEL_ENV */
      "import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
      /* Enable use of import.meta.env.VERCEL_URL */
      "import.meta.env.VERCEL_URL": JSON.stringify(process.env.VERCEL_URL),
    },
    build: {
      manifest: true,
      target: "es2022",
      rollupOptions: {
        /* Exclude files from bundle */
        /*
        external: (path) =>
          path.endsWith(".test.js") &&
          !path.includes("/batch/") &&
          !path.includes("/preview/") &&
          !path.includes("/vercel/"),
        */
      },
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
  };
});
