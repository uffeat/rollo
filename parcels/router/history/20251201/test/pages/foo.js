const { component } = await use("@/component");
const { layout } = await use("@/layout/");

const counts = { load: 0, update: 0 };

const page = component.main("container", component.h1({ text: "Foo" }));
const loads = component.p({ parent: page });
const updates = component.p({ parent: page });

const residualComponent = component.p({ parent: page });

export default (mode, query, ...args) => {
  if (mode.enter) {
    counts.load++;
    loads.text = `Times loaded: ${counts.load}`;
    layout.clear(":not([slot])");
    layout.append(page);
  } else if(mode.update) {
    counts.update++;
    updates.text = `Times updated without load: ${counts.update}`;
  }

  if (args) {
    residualComponent.text = `Got residual: ${args}`;
  } else {
    residualComponent.clear();
  }
};
