const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { Reactive, Ref, ref, reactive } = await use("@/state.js");
const { Sheet, css, scope } = await use("@/sheet.js");

const { router } = await use("@/router.js");

const _path = "/color.page";
//console.log('meta:', import.meta.url)

const state = Ref.create();

const page = component.main("container", component.h1({ text: "Colors" }));

const tag = component.div("rounded", {
  height: css.rem(3),
  width: css.rem(3),
});

const menu = component.menu(
  "d-flex.justify-content-end.column-gap-2",
  { parent: page, role: "group" },
  component.div(
    "btn-group",
    component.button("btn.btn-primary", { text: "Red", _value: "red" }),
    component.button("btn.btn-primary", { text: "Green", _value: "green" }),
    component.button("btn.btn-primary", { text: "Blue", _value: "blue" })
  ),

  tag
);

/* user -> state */
menu.on.click = (event) => {
  if (event.target._value) {
    state.update(event.target._value);
  }
};

/* state -> tag */
state.effects.add(
  (current) => {
    tag.update({ backgroundColor: current });
  },
  (current) => !!current
);

/* state -> url */
state.effects.add(
  (current) => {
    //history.replaceState({}, "", `${_path}/${current}`);
    history.pushState({}, "", `${_path}/${current}`);
  },
  (current) => !!current
);

export default ({ residual }) => {
  console.log("Color page got residual:", residual); ////
  state.update(residual);

  layout.clear(":not([slot])");
  layout.append(page);
};
