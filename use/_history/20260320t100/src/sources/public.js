/* Registers public assets as source (/). 
NOTE
- Use for:
  - Add-hoc added global sheets ("hypermedia").
  - Libs that do not expose npm packages/ESM ("hypermedia").
  - Large-volume small-size content and data assets.
  - Other small-size assets that do not require minification
    and super-fast loading.
- Raw js not supported. Use '@/'-imports instead.
*/

import { UseError } from "../tools";
import { use } from "../use";

const cache = new Map();
const processing = new Map();

use.sources.add("/", async ({ options, owner, path }) => {
  const { as, raw } = options;
  // Global sheet by link (FOUC-free)
  if (path.type === "css" && as === undefined && raw !== true) {
    // NOTE 'error' event does not fire reliably, therefore attempt raw 
    // import, which will throw for invalid paths; it carries a small perf 
    // penalty, so only do in DEV.
    if (use.meta.DEV) {
      await use(path.path, { raw: true });
    }
    const href = `${owner.meta.base}${path.path}`;
    let link = document.head.querySelector(
      `link[rel="stylesheet"][href="${href}"]`,
    );
    if (link) {
      if (processing.has(href)) return processing.get(href);
      return link;
    }
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    const { promise, resolve, reject } = Promise.withResolvers();
    processing.set(href, promise);
    link.addEventListener(
      "load",
      (event) => {
        resolve(link);
        processing.delete(href);
      },
      { once: true },
    );
    link.addEventListener(
      "error",
      (event) => {
        processing.delete(href);
        reject(new UseError(`Failed to load sheet: ${href}`));
      },
      { once: true },
    );
    document.head.append(link);
    return await promise;
  }
  if (path.type === "js" && raw !== true) {
    /* Old-school script */
    if (as === "script") {
      const src = `${owner.meta.base}${path.path}`;
      let script = document.head.querySelector(`script[src="${src}"]`);
      if (script) {
        if (processing.has(src)) return processing.get(src);
        return true;
      }
      script = document.createElement("script");
      script.src = src;
      const { promise, resolve, reject } = Promise.withResolvers();
      processing.set(src, promise);
      script.addEventListener(
        "load",
        (event) => {
          processing.delete(src);
          resolve(true);
        },
        { once: true },
      );
      script.addEventListener(
        "error",
        (event) => {
          processing.delete(src);
          reject(new UseError(`Failed to load script: ${src}`));
        },
        { once: true },
      );
      document.head.append(script);
      return await promise;
    }
    /* Module */
    if (as === undefined) {
      return await owner.import(`${owner.meta.base}${path.path}`);
    }
  }
  /* Text-based asset */
  if (cache.has(path.full)) {
    return cache.get(path.full);
  }
  if (processing.has(path.full)) {
    const promise = processing.get(path.full);
    const result = await promise;
    processing.delete(path.full);
    return result;
  } else {
    const { promise, resolve, reject } = Promise.withResolvers();
    processing.set(path.full, promise);
    try {
      const result = (
        await (
          await fetch(`${owner.meta.base}${path.path}`, {
            cache: "no-store",
          })
        ).text()
      ).trim();
      const tester = document.createElement("div");
      tester.innerHTML = result;
      if (tester.querySelector(`meta[index]`)) {
        UseError.raise(`Invalid path: ${path.full}`);
      }
      cache.set(path.full, result);
      resolve(result);
      return result;
    } catch (error) {
      reject(error);
      throw error;
    } finally {
      processing.delete(path.full);
    }
  }
});
