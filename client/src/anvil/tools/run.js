export const run = new (class {
  #_ = {};

  get window() {
    return this.#_.window;
  }

  set window(window) {
    this.#_.window = window;
  }

  /* Enables running Python scripts.
  NOTE 
  - Scripts must contain a 'main' function with the signature 
    `(use, *args, **kwargs)` (or similar). Results from 'main' functions
    must be postMessage-compatible. The 'use' arg gives the 'main' function
    full access to everything in the iworker; can therefore be used to trigger
    advanced side effects Anvil-side.  
  - Use arrow to preserve "class this"; required since method is used out-of-context. */
  run = async ({ text, path }, kwargs = {}, ...args) => {
    if (!text) {
      text = await use(path, { raw: true });
    }
    const { promise, resolve, reject } = Promise.withResolvers();
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.data);
      }
      channel.port1.close();
    };
    this.window.postMessage(
      { type: "run", text, path, args, kwargs },
      use.meta.anvil.origin,
      [channel.port2]
    );
    return promise;
  }
})();

/* Integrate 'run' into import engine */
use.types.add("py", (text, { path }) => {
  return (kwargs, ...args) => {
    return run.run({ text, path: path.path }, kwargs, ...args);
  };
});
use.redirects.add((specifier, options, ...args) => {
  if (specifier.startsWith("@/") && specifier.endsWith(".py")) {
    return `/parcels${specifier.slice(1)}`;
  }
});
