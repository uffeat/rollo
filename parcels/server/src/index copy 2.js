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
  call(name) {
    return (query = {}, options = {}) => {
      return async (kwargs = {}, ...args) => {
        const submission = Submission();
        query.submission = submission;
        const url = `${
          use.meta.server.origin
        }/_/api/main/${name}?query=${JSON.stringify(query)}`;
        const response = await fetch(url, {
          body: JSON.stringify({ data: { args, kwargs } }),
          ...OPTIONS,
        });

        
        const meta = Meta(response);
        console.log("meta:", meta); ////

        // json (typical)
        if (meta.type.startsWith("application/json")) {
          const parsed = await response.json();
          Exception.if("__error__" in parsed, parsed.__error__);
          return parsed;
        }

        // binary (blob or bytes)
        const content = await response[options.encode || "blob"](); ////
        return { content, ...meta };

        
      };
    };
  }
})();

/* Proxy version of 'Server'. */
const server = new Proxy(async () => {}, {
  get(_, name) {
    return Server.call(name);
  },
});

use.compose("server", server);

export { Server, Submission, server };

// Add to import engine
use.sources.add("server", async ({options, path}) => {
  return () => {
    return (query = {}) => {
      return Server.call(path.stem)(query, options)
    }


    
   
  };
});
