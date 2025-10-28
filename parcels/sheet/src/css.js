export const css = new Proxy(
  {},
  {
    get(_, key) {
      return (value) => `${value}${key}`;
    },
  }
);