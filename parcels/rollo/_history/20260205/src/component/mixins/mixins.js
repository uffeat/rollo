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

export const Mixins = (...args) => {
  const include = args.filter(
    (a) => typeof a === "string" && !a.startsWith("!")
  );
  const exclude = args
    .filter((a) => typeof a === "string" && a.startsWith("!"))
    .map((a) => a.slice(1));
  const add = args.filter((a) => typeof a === "function");

  exclude.push("for_", "novalidation");

  const result = Object.entries(mixins)
    .filter(([name, mixin]) => {
      if (include.includes(name)) return true;
      if (exclude.includes(name)) return false;
      return true;
    })
    .map(([name, mixin]) => mixin);

  result.push(...add);
  return result;
};
