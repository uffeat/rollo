import "../use";

const { Exception, is } = await use("@/rollo/");

const options = {
  cache: "no-store",
  method: "POST",
  headers: { "content-type": "text/plain" },
};

import { Submission } from "./tools/submission";

/* Utility for calling HTTP-endpoints, stateless and zero pre-flight. */
const server = new Proxy(
  {},
  {
    get(_, name) {
      return (query = {}) => {
        return async (kwargs = {}, ...args) => {
        const submission = Submission();
        query.submission = submission;
        import.meta.env.DEV &&  console.log("Server origin:", use.meta.server.origin); ////
        const url = `${
          use.meta.server.origin
        }/_/api/main/${name}?query=${JSON.stringify(query)}`;
        const response = await fetch(url, {
          body: JSON.stringify({ data: { args, kwargs } }),
          ...options,
        });
        const content_type = response.headers.get("content-type");
        import.meta.env.DEV && console.log("content_type:", content_type);
        // json (typical)
        if (content_type.startsWith("application/json")) {
          const parsed = await response.json();
          Exception.if("__error__" in parsed, parsed.__error__);
          return parsed;
        }
        // blob (default)
        const result = await response.blob();
        const meta = {
          env: use.meta.server.env,
          detail: {},
          name,
          origin: use.meta.server.origin,
          request_origin: location.origin,
          request_type: "api",
          same_origin: location.origin === use.meta.server.origin,
          submission: submission,
          test: query.test || false,
        };
        return { meta, result };
      };

      }



      



    },
  },
);

use.compose("server", server);

export { Submission, server };

// Add to import engine
use.sources.add("server", async (...args) => {
  return async (query = {}, kwargs = {}, ...args) => {
    return await server[path.stem](...args);
  };
});
