Object.entries({
  ...import.meta.glob("./pages/**/*.html", {
    import: "default",
    query: "?raw",
  }),
}).map(([k, load]) => {
  const path = `${k.slice(1)}`;
  return [path, load];
}).forEach(([path, load]) => {
  use.add(path, load)
})

const boom = await use('/pages/boom.x.html')

console.log('boom:', boom)



