const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { Reactive, Ref, ref, reactive } = await use("@/state.js");

const state = Ref.create();

const page = component.main("container", component.h1({ text: "Page not found" }));
const detail = component.p({ parent: page })

/* state -> tag and router */
state.effects.add(
  (current) => {
    if (current) {
     detail.text = `Invalid path: ${current}.`
    } else {
     detail.clear()
     
    }
  }
  
);


export default ({ change } = {}, args) => {
  if (change) {
    layout.clear(":not([slot])");
    layout.append(page);
  }
  state.update(args);
};
