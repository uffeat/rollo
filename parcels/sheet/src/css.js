const { WebComponent } = await use("@/component.js");

const reference = WebComponent();

export const css = new Proxy(
  {},
  {
    get(_, key) {
      if (key in reference.style) {
        return new Proxy(
          {},
          {
            get(_, value) {
              return { [key]: value };
            },
          }
        );
      }
      return (value) => `${value}${key}`;
    },
  }
);
