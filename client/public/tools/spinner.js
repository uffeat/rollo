const { component } = await use("@/rollo/");

const Component = ({
  color = "primary",
  parent,
  size = "1rem",
  ...updates
} = {}) => {
  return component.div(
    ".d-flex.justify-content-center",
    { parent, '[spinner]': true },
    component.div(
      `spinner-border text-${color}`,
      {
        role: "status",
        height: size,
        width: size,
        ...updates,
      },
      component.span("visually-hidden", "Loading..."),
    ),
  );
};

export const Spinner = new Proxy(async () => {}, {
  get(target, key) {
    if (key === "while") {
      return async (props, action) => {
        const spinner = Component(props);
        const result = await action();
        spinner.remove();
        return result;
      };
    }
  },
  apply(target, thisArg, args) {
    return Component(...args);
  },
});
