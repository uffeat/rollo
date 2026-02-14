import "../use";

import { Submission } from "./tools/submission";
import _fetch from "./tools/fetch";

/* Utility for calling HTTP-endpoints  */
export const server = new Proxy(
  {},
  {
    get(_, name) {
      return async (...args) => {
        return _fetch(
          `${
            use.meta.server.origin
          }/_/api/main?name=${name}&token=${use.meta.token}&session=${use.meta.session}&submission=${Submission()}`,
          ...args
        );
      };
    },
  }
);

use.compose("server", server);
