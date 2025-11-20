const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

const page = component.main("container", component.h1({ text: "Bar" }));

export default ({ change } = {}) => {
  if (change) {
    layout.clear(":not([slot])");
    layout.append(page);
  }
};
