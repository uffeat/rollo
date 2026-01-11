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
            use.meta.companion.origin
          }/_/api/main?name=${name}&submission=${Submission()}`,
          ...args
        );
      };
    },
  }
);

/* Verify connection */
if (import.meta.env.DEV) {
  const { Exception, match } = await use("@/rollo/");
  const dto = [
    { yes: true, no: false, number: 1, text: crypto.randomUUID() },
    [crypto.randomUUID(), 0, 1, true, false, null],
  ];
  const { result: _dto, meta } = await server.echo(dto[0], ...dto[1]);
  Exception.if(!match(dto, _dto), `Server connection could not be verified.`);
  console.info("Server connection verified for:", meta);
}
