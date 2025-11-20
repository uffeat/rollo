const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

const counts = {load: 0, update: 0}

const page = component.main("container", component.h1({ text: "Foo" }));
const loads = component.p({ parent: page })
const updates = component.p({ parent: page })


const argsComponent = component.p({ parent: page })


export default ({ change } = {}, args) => {
  

  if (change) {
    counts.load++
    loads.text = `Times loaded: ${counts.load}`
    layout.clear(":not([slot])");
    layout.append(page);
  } else {
    counts.update++
    updates.text = `Times updated without load: ${counts.update}`
  }

  if (args) {
    argsComponent.text = `Got args: ${args}`
  } else {
    argsComponent.clear()
  }
};
