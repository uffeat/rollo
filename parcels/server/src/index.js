import "../use";
import { Meta } from "./tools/meta";
import { Submission } from "./tools/submission";

const { Exception, freeze, is, typeName } = await use("@/rollo/");

const OPTIONS = freeze({
  cache: "no-store",
  method: "POST",
  headers: { "content-type": "text/plain" },
});

/* Tool for calling HTTP-endpoints, stateless and zero pre-flight. */
const Server = new (class {
  call(target) {
    return ({ callback, encode, test = false, ...query } = {}) => {
      return async (kwargs = {}, ...args) => {
        const submission = Submission();
        const search = `query=${JSON.stringify({ submission, test, ...query })}`;
        //import.meta.env.DEV && console.log("search:", search); ////
        const url = `${use.meta.server.origin}/_/api/main/${target}?${search}`;
        const response = await fetch(url, {
          body: JSON.stringify({ data: { args, kwargs } }),
          ...OPTIONS,
        });
        // Extract meta
        const { name, type } = Meta(response);
        //import.meta.env.DEV && console.log("name:", name); ////
        //import.meta.env.DEV && console.log("type:", type); ////
        // JSON (typical)
        if (type.startsWith("application/json")) {
          const parsed = await response.json();
          Exception.if("__error__" in parsed, parsed.__error__);
          const { result, meta } = parsed;
          callback && callback({ result, meta });
          return { result, meta };
        }
        // Binary: blob (default) or bytes
        const content = await response[encode || "blob"](); ////
        callback && callback({ content, name, type });
        return { content, name, type };
      };
    };
  }
})();

/* Proxy version of 'Server'. */
const server = new Proxy(async () => {}, {
  get(_, target) {
    return Server.call(target);
  },
});

// Add to import engine
use.sources.add("server", ({ options, path }) => {
  return async (kwargs, ...args) => {
    const { callback, encode, test = false, ...query } = options;
    return await Server.call(path.stem)({ callback, encode, test, ...query })(
      kwargs,
      ...args,
    );
  };
});

// Provide global access
use.compose("server", server);

export { Server, Submission, server };
