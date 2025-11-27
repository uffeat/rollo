const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");

const state = ref();

const page = component.main(
  "container",
  component.h1({ text: "Page not found" })
);
const detail = component.p({ parent: page });

/* state -> tag and router */
state.effects.add((path) => {
  if (path) {
    detail.text = `Invalid path: ${path}.`;
  } else {
    detail.clear();
  }
});

export default (path) => {
  layout.clear(":not([slot])");
  layout.append(page);
  state(path);
};
