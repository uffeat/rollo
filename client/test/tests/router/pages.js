export const BASE = "/test/test.html";
const START = "./pages".length;

export const pages = (() => {
  return Object.fromEntries(
    Object.entries(import.meta.glob("./pages/**/*.js")).map(([k, load]) => {
      let path = `${BASE}${k.slice(START, -3)}`;
      if (path.endsWith("_")) {
        path = path.slice(0, -2);
      }
      return [path, load];
    })
  );
})();
