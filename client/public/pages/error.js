const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state.js");

const state = ref();

const page = component.main(
  "container",
  component.h1({ text: "Page not found" })
);
const detail = component.p({ parent: page });

/* state -> tag and router */
state.effects.add((current) => {
  if (current) {
    detail.text = `Invalid path: ${current}.`;
  } else {
    detail.clear();
  }
});

export default ({ change, path }) => {
  if (change) {
    layout.clear(":not([slot])");
    layout.append(page);
  }
  state(path);
};
