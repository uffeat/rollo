import "../use";

const { Exception, is } = await use("@/rollo/");

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

import { Submission } from "./tools/submission";

const parse = (args) => {
  const kwargs = args.find((a, i) => !i && is.object(a)) || {};
  const query =
    args.find((a, i) => (!i || i === 1) && is.object(a) && a !== kwargs) || {};
  args = args.filter((a, i) => a !== kwargs && a !== query);
  return { args, kwargs, query };
};

const search = (query) => {
  const stringified = new URLSearchParams(query).toString();
  if (stringified) {
    return `&${stringified}`;
  }
  return "";
};

/* Utility for calling HTTP-endpoints, stateless and zero pre-flight. */
const server = new Proxy(
  {},
  {
    get(_, name) {
      return async (..._args) => {
        const { args, kwargs, query } = parse(_args);

        const url = `${
          use.meta.server.origin
        }/_/api/main?name=${name}&submission=${Submission()}${search(query)}`;

        const response = await fetch(url, {
          body: JSON.stringify({ data: { args, kwargs } }),
          ...options,
        });

        const parsed = await response.json();
        parsed.response = response;
        Exception.if("__error__" in parsed, parsed.__error__);

        return parsed;
      };
    },
  },
);

use.compose("server", server);

export { Submission, server };
