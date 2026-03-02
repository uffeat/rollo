import "../use";

import { Submission } from "./tools/submission";
import _fetch from "./tools/fetch";

/* Utility for calling HTTP-endpoints  */
const server = new Proxy(
  {},
  {
    get(_, name) {
      return async (...args) => {
        return _fetch(
          `${
            use.meta.server.origin
          }/_/api/main?name=${name}&session=${use.meta.session}&submission=${Submission()}&token=${use.meta.token}`,
          ...args,
        );
      };
    },
  },
);

use.compose("server", server);

export { Submission, server };
