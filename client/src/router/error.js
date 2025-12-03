import "../use.js";

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

const page = component.main(
  "container",
  component.h1({ text: "Page not found" })
);
const details = component.p({ parent: page });

export default (message) => {
  if (message) {
    if (message instanceof Error) {
      message = message.message;
    }

    details.text = message;
  } else {
    details.clear();
  }

  layout.clear(":not([slot])");
  layout.append(page);
};
