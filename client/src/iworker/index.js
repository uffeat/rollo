/* Sets up iframe that embeds Anvil-served app and returns bridge tools. 
Intended as a non-visual DOM-aware stateful "iworker" that enables
- true background tasks
- non-cors restricted access to HTTP-endpoints
- access to Anvil server functions
- use of this app's assets in the iworker
- "Python-in-the-browser".

The core coms patterns are:
- parent->iworker->parent request->response; general-purpose.
- iworker->parent 'receiver'; a 'Reactive' instance residing in parent, but 
  updated by the iworker. Since it's a singleton, keep number of items small,
  perhaps 5-10.
Other patterns are supported, but these should be considered "emerging" in the
sense that they do work well, but may be changed/purged in future - or used
for testing only. If needed yet other patterns will be added; largely a
question of combining existing patterns and tools, so easy to implement

Re performance...
Loading the iworker introduces some latency. However, in PROD, the Anvil
service worker kicks in and the latency becomes acceptable - perhaps 1s. 
This does not happen in DEV, presumably because it's not https.
The loading latency hardly affects the app per se, but only "time-to-bridge".
Parent <-> iworkers coms feel almost instantaneous. However, watch out for
initial coms, of course subject to iworker loading. */

import "./tools/assets";
import { receiver } from "./tools/receiver";
import { receivers } from "./tools/receivers";
import { request } from "./tools/request";
import { run } from "./tools/run";

const { Exception, app, component, is } = await use("@/rollo/");

const iframe = component.iframe({
  src: `${use.meta.companion.origin}/embedded`,
  slot: "data",
  id: "iworker",
  name: "iworker",
  title: "iworker",
});

/* Get access to contentWindow */
const promise = new Promise((resolve, reject) => {
  iframe.on.load({ once: true }, (event) => {
    resolve(iframe.contentWindow);
  });
});
app.append(iframe);
const contentWindow = await promise;

request.window = contentWindow;
run.window = contentWindow;

/* Wraps 'request' and additional tools for a more 'RPC-like' DX. */
const iworker = new Proxy(
  {},
  {
    get(_, key) {
      if (key === "receiver") {
        return receiver;
      }
      if (key === "receivers") {
        return receivers;
      }
      if (key === "run") {
        return run.run;
      }
      return (...args) => {
        return request.request(key, ...args);
      };
    },
  }
);

/* Verify connection */
if (import.meta.env.DEV) {
  const BROKEN = 4000;
  const SLOW = 1000;
  const test = (timeout, { retry = true } = {}) => {
    const expected = crypto.randomUUID();
    iworker
      .echo(expected, { timeout })
      .then((echo) => {
        Exception.if(echo !== expected, `Incorrect echo.`);
        console.info("Connection verified.");
      })
      .catch((error) => {
        if (retry) {
          console.warn(`Verifying again...`);
          test(BROKEN, { retry: false });
        } else {
          console.error(error);
          throw new Error(`Connection could not be verified.`);
        }
      });
  };
  console.info("Verifying iworker connection...");
  test(SLOW, { retry: true });
}

export { iworker };
