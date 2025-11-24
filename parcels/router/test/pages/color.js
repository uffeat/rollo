const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state.js");
const { css } = await use("@/sheet.js");
const { router } = await use("@/router/");



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
    component.button(
      "btn.btn-outline-primary",
      { text: "Red", value: "red", "data.colorStuff": "red" },
      function () {
        this.dataset.colorStuff = "red";
      }
    ),
    component.button("btn.btn-outline-primary", {
      text: "Green",
      value: "green",
    }),
    component.button("btn.btn-outline-primary", {
      text: "Blue",
      value: "blue",
    })
  ),
  tag
);

/* user -> router */
menu.on.click = (event) => {
  if (event.target.value) {
    router(`/color/${event.target.value}`);
  }
};

/* state -> tag */
state.effects.add((current) => {
  if (current) {
    tag.update({ backgroundColor: current });
  } else {
    tag.update({ backgroundColor: "gray" });
  }
});

export default (mode, query, ...args) => {
  if (mode.enter) {
    layout.clear(":not([slot])");
    layout.append(page);
  }
  if (!mode.exit) {
    /* router -> state */
    state(args);
  }
};
