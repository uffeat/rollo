import { Submission } from "./tools/submission";
import _fetch from "./tools/fetch";

/* Utility for calling HTTP-endpoints  */
export const server = new Proxy(
  {},
  {
    get(_, name) {
      return async (data) => {
        data = { data };
        return _fetch(
          `${use.meta.companion.origin}/_/api/main?name=${name}&submission=${Submission()}`,
          data
        );
      };
    },
  }
);


export const vercel = new Proxy(
      {},
      {
        get(_, name) {
          return async (data = {}) => {
            return _fetch(
              `/api/gate?name=${name}&submission=${Submission()}`,
              data
            );
          };
        },
      }
    );