const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

const page = component.main("container", component.h1({ text: "Home" }));

export default (mode) => {
  if (mode.enter) {
    layout.clear(":not([slot])");
    layout.append(page);
  }
};
