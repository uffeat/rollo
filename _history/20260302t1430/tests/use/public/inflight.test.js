/*
/use/public/inflight.test.js
- Verifies inflight handling for link- and script-based public assets.
*/

const isPromise = (value) => typeof value?.then === "function";

export default async () => {
  /* CSS link inflight should dedupe and reuse */
  const cssPath = "/test/bar.css";
  const cssLoad1 = use(cssPath);
  const cssLoad2 = use(cssPath);
  if (!isPromise(cssLoad1) || !isPromise(cssLoad2)) {
    throw new Error("CSS loads should be promises while inflight.");
  }
  const [link1, link2] = await Promise.all([cssLoad1, cssLoad2]);
  if (link1 !== link2) {
    throw new Error("CSS inflight loads should resolve to the same link.");
  }
  const link3 = await use(cssPath);
  if (link3 !== link1) {
    throw new Error("CSS load after settle should reuse the existing link.");
  }
  link1.remove();

  /* Script inflight should also dedupe and wait for load */
  const scriptPath = "/test/ding.js";
  const scriptSrc = `${use.meta.base}${scriptPath}`;
  const scriptLoad1 = use(scriptPath, { as: "script" });
  const scriptLoad2 = use(scriptPath, { as: "script" });
  if (!isPromise(scriptLoad1) || !isPromise(scriptLoad2)) {
    throw new Error("Script loads should be promises while inflight.");
  }
  const [result1, result2] = await Promise.all([scriptLoad1, scriptLoad2]);
  if (result1 !== true || result2 !== true) {
    throw new Error("Script inflight loads should resolve after load.");
  }
  const scripts = document.head.querySelectorAll(`script[src="${scriptSrc}"]`);
  if (scripts.length !== 1) {
    throw new Error("Script load should append only one script element.");
  }
  scripts[0].remove();

  console.log('Seems to work :-)')
};
