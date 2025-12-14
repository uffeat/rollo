/* Create sheets object with CSS (text) values for testing */
export const sheets = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("./sheets/*.css", {
      eager: true,
      import: "default",
      query: "?raw",
    }),
  }).map(([path, css]) => [path.slice("./sheets".length+1, -".css".length), css])
);


