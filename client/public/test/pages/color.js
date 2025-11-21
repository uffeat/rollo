const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state.js");
const { css } = await use("@/sheet.js");
const { router } = await use("@/router.js");

const state = ref();

const page = component.main("container", component.h1({ text: "Color" }));

const tag = component.div("rounded", {
  height: css.rem(3),
  width: css.rem(3),
});

const menu = component.menu(
  "d-flex.justify-content-end.column-gap-2",
  { parent: page, role: "group" },
  component.div(
    "btn-group",
    component.button("btn.btn-outline-primary", { text: "Red", _value: "red" }),
    component.button("btn.btn-outline-primary", {
      text: "Green",
      _value: "green",
    }),
    component.button("btn.btn-outline-primary", {
      text: "Blue",
      _value: "blue",
    })
  ),
  tag
);

/* user -> state */
menu.on.click = (event) => {
  if (event.target._value) {
    state(event.target._value);
  }
};

/* state -> tag and router */
state.effects.add((current) => {
  if (current) {
    tag.update({ backgroundColor: current });
    router(`/color/${current}`);
  } else {
    tag.update({ backgroundColor: "gray" });
  }
});

export default (mode, query, ...args) => {
  if (mode) {
    layout.clear(":not([slot])");
    layout.append(page);
  }
  state(args);
};
