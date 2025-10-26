const cache = new Map();

export function text(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }
  const element = document.createElement("div");
  element.classList.add("asset");
  element.setAttribute("path", path);
  document.head.append(element);
  const value = getComputedStyle(element).getPropertyValue("--asset").trim();
  element.remove();
  if (!value) {
    throw new Error(`Invalid path: ${path}`);
  }
  const result = atob(value.slice(1, -1));
  cache.set(path, result);
  return result;
}
