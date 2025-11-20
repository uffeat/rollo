const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { Reactive, Ref, ref, reactive } = await use("@/state.js");
const { Sheet, css, scope } = await use("@/sheet.js");
const { router } = await use("@/router.js");

const __path__ = `/${import.meta.url.split("/").at(-1).split("?").at(0)}`;
//const __path__ = `/${location.pathname.split("/").at(1)}.js`;
//console.log('__path__:', __path__)

const base = __path__.split(".").slice(0, -1).join(".");
//const base = `/${location.pathname.split("/").at(1)}`;
//console.log('base:', base)



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
    history.replaceState({}, "", `${base}/${current}`);
  },
  (current) => !!current
);

export default ({ residual }) => {
  //console.log("Color page got residual:", residual); ////
  state.update(residual);
  layout.clear(":not([slot])");
  layout.append(page);
};
