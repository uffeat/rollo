/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";

if (window !== window.parent) {
  const { Exception, app, Sheet, component, element, css, typeName, is } =
    await use("@/rollo/");

  const _origin = use.meta.DEV ? "https://rollohdev.anvil.app" : "https://rolloh.anvil.app";

  const request = (target, data, { timeout } = {}) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    /* Create dedicated channel for the specific request */
    const channel = new MessageChannel();

    const timer = (() => {
      if (is.undefined(timeout)) {
        return;
      }
      return setTimeout(() => {
        channel.port1.close();
        reject(new Error(`Timeout for: ${target}`));
      }, timeout);
    })();

    /* Listen on port1 for the response */
    channel.port1.onmessage = (event) => {
      Exception.if(
        !is.object(event.data),
        `'event.data' should be a plain object.`,
        () => console.error("event.data:", event.data)
      );
      if (!is.undefined(timer)) {
        clearTimeout(timer);
      }
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.data);
      }
      /* Clean up */
      channel.port1.close();
    };
    /* Send request with port2 transferred to parent */
    window.parent.postMessage({ type: "request", target, data }, _origin, [
      channel.port2,
    ]);
    return promise;
  };

  const anvil = new Proxy(
    {},
    {
      get(_, key) {
        return (...args) => {
          return request(key, ...args);
        };
      },
    }
  );

  const result = await anvil.echo(42);
  console.log("result:", result);

  //console.log('iframe sending ready')
  //window.parent.postMessage("ready", _origin);
}

/*
import Anvil from "@/anvil";
const { anvil } = await Anvil;
anvil.echo(42).then((data) => {
  console.log("data:", data);
});
*/

/*

anvil.echo(42).then((data) => {
  console.log("data:", data);
});



console.log('Loading...')
const { anvil, request } = await Anvil("https://rollohdev.anvil.app");
console.log('Loaded')


const { Exception, app, Sheet, component, element, css, typeName, is } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");
*/

/*
anvil.echo(42).then((data) => {
    console.log("data:", data);
  });

 try {
    await anvil.bad();
  } catch (error) {
    console.log("Error as expected:", error.message);
  }

  try {
    await anvil.noexist();
  } catch (error) {
    console.log("Error as expected:", error.message);
  }
    */

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
