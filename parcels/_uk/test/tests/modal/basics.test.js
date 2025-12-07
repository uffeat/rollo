/*
/modal/basics.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Sheet, css } = await use("@/sheet");
const { modal } = await use("@/uk");

export default async () => {
  const content = component.div(
    {
      flexGrow: String(1),
      ...css.display.flex,
      ...css.flexDirection.column,
    },
    component.h1({ text: "Modal", margin: String(0) }),
    component.p({ text: "Some content..." }),
    component.menu(
      {
        ...css.display.flex,
        ...css.justifyContent.flexEnd,
        columnGap: css.rem(1),
        paddingRight: css.rem(1),
        margin: 0,
        /* Push menu down */
        ...css.marginTop.auto,
        "@click": (event) => {
          const element = event.target.closest("[uk-modal]");
          if ("_value" in event.target) {
            element.send("_close", { detail: event.target._value });
          }
        },
      },
      component.button("btn.btn-success", {
        text: "Yes",
        _value: true,
      }),
      component.button("btn.btn-danger", {
        text: "No",
        _value: false,
      })
    )
  );

  await (async () => {
    const result = await modal(content);
    console.log("result:", result);
  })();

  await (async () => {
    const result = await modal(content, { dismissible: false });
    console.log("result:", result);
  })();

  await (async () => {
    const result = await modal(content, { full: true });
    console.log("result:", result);
  })();
};
