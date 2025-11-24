export const BASE = "/test/test.html";
const START = "./pages".length;

export const pages = (() => {
  return Object.fromEntries(
    Object.entries(import.meta.glob("./pages/**/*.js")).map(([k, load]) => {
      const path = `${BASE}${k.slice(START, -3)}`;
      return [path, load];
    })
  );
})();

const home = pages[`${BASE}/home`]
if (home) {
  pages[`${BASE}`] = home
}

