/* Adds support for  synthetic x.html/x.template assets.
NOTE Use the html-associated file type 'template' for html public assets 
to avoid Vercel-injections and Anvil asset registration.
*/
import { use } from "../use";

const cache = new Map();

use.processors.add("x.html", "x.template", async (result, { path }) => {
  // Type guard
  if (!(typeof result === "string")) return;
  const { component, Sheet } = await use("@/rollo/");
  if (cache.has(path.full)) return cache.get(path.full);
  const fragment = component.div({ innerHTML: result });
  const mod = await use.module(
    `export const __path__ = "${path.path}";${fragment
      .querySelector("script")
      .textContent.trim()}`,
    path.path,
  );
  // Get exposed components
  const components = Object.fromEntries(
    Object.entries(mod).filter(([k, v]) => {
      return v instanceof HTMLElement;
    }),
  );
  // Prepare context
  const assets = {};
  // Parse styles
  for (const element of fragment.querySelectorAll(`style`)) {
    // Construct and adopt sheet scoped to exposed component
    if (element.hasAttribute("for")) {
      const target = element.getAttribute("for");
      const sheet = Sheet.create(
        `[uid="${components[target].uid}"] { ${element.textContent.trim()} }`,
      );
      if (element.hasAttribute("global")) {
        sheet.use();
      }
      if (element.hasAttribute("name")) {
        assets[element.getAttribute("name")] = sheet;
      }
      continue;
    }
    // Construct and adopt global sheet and if named add to context
    if (element.hasAttribute("global")) {
      const sheet = Sheet.create(element.textContent.trim()).use();
      if (element.hasAttribute("name")) {
        assets[element.getAttribute("name")] = sheet;
      }
    } else {
      // Construct named sheet and add to context
      assets[
        element.hasAttribute("name")
          ? element.getAttribute("name")
          : "__sheet__"
      ] = Sheet.create(element.textContent.trim());
    }
  }
  // Parse templates
  for (const element of fragment.querySelectorAll(`template`)) {
    assets[
      element.hasAttribute("name")
        ? element.getAttribute("name")
        : "__template__"
    ] = element.innerHTML.trim();
  }
  Object.freeze(assets);
  // Build pseudo module
  const pseudo = { __type__: "Module", assets };
  for (const [key, value] of Object.entries(mod)) {
    if (typeof value === "function") {
      if (key === "setup") {
        // NOTE Do not include any 'setup' function member, but call
        // immediately with context.
        // Useful for one-off setup that requires context awareness.
        await value.call(assets, assets);
        continue;
      }
      // Bind function members to context
      pseudo[key] = value.bind(assets);
      continue;
    }
    pseudo[key] = value;
  }
  cache.set(path.full, Object.freeze(pseudo));
  return pseudo;
});
