export const pages = (() => {
  const START = "./pages".length;
  const pages = Object.fromEntries(
    Object.entries(import.meta.glob("./pages/**/*.js")).map(([k, load]) => {
      const path = `${k.slice(START, -3)}`;
      return [path, load];
    })
  );
  const home = pages[`/home`];
  if (home) {
    pages["/"] = home;
  }
  return pages;
})();