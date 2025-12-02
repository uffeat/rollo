const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { reactive } = await use("@/state");

const state = reactive();

const page = component.main("container", component.h1({ text: "About" }));

const out = component.output({ parent: page });

state.effects.add((change) => {
  out.clear();
  for (const [key, value] of Object.entries(change)) {
    component.p({ parent: out, text: `${key}=${value}` });
  }
});

export default (mode, query) => {
  if (mode) {
    layout.clear(":not([slot])");
    layout.append(page);
  }

  state(query);
};
