const cache = new Map();

export function text(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const element = document.createElement("div");
  /* TODO
  - Use DocumentFragment, resue element
  - OR use link element
   */

  element.setAttribute("__path__", path);
  document.head.append(element);
  const value = getComputedStyle(element)
    .getPropertyValue("--__asset__")
    .trim();
  element.remove();
  if (!value) {
    throw new Error(`Invalid path: ${path}`);
  }

  const result = atob(value.slice(1, -1));

  /* TODO
  const bin = atob(value.slice(1, -1));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  const result = new TextDecoder("utf-8").decode(bytes);
  */

  cache.set(path, result);
  return result;
}
