import "../use";

const { Exception } = await use("@/rollo/");

const options = {
  method: "POST",
  headers: { "content-type": "text/plain" },
};

import { Submission } from "./tools/submission";

/* Utility for calling HTTP-endpoints, stateless and zero pre-flight. */
const server = new Proxy(
  {},
  {
    get(_, name) {
      return async (query = {}, kwargs = {}, ...args) => {
        query.submission = Submission();
        query = JSON.stringify(query);
        const url = `${
          use.meta.server.origin
        }/_/api/main/${name}?query=${query}`;
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
        // image
        // XXX Not sure how to use this?
        if (content_type.startsWith("image/")) {
          const result = await response.blob();
          return { result };
        }
        // Fallback: blob
        // XXX Not sure how to use this?
        const result = await response.blob();
        return { result };
      };
    },
  },
);

use.compose("server", server);

export { Submission, server };
