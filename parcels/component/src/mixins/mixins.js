const START = "./mixins/".length;
const END = -".js".length;

export const mixins = Object.freeze(
  Object.fromEntries(
    Object.entries(
      import.meta.glob("./mixins/*.js", {
        eager: true,
        import: "default",
      })
    ).map(([k, v]) => [k.slice(START, END), v])
  )
);
