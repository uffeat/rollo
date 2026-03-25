import "../use";

import { Submission } from "./tools/submission";
import { call, state } from "./tools/call";

/* Utility for calling HTTP-endpoints  */
const server = new Proxy(
  {},
  {
    get(_, name) {
      return async (...args) => {
        return call(
          `${
            use.meta.server.origin
          }/_/api/main?name=${name}&submission=${Submission()}`,
          ...args,
        );
      };
    },
  },
);

use.compose("server", server);

export { Submission, server, state };
