/* 
images.js
Tests scroll/overflow/flex behavior.
*/
const { component } = await use("@/component.js");
const { Sheet, css } = await use("@/sheet.js");
const { toTop } = await use("@/tools/scroll.js");

const sheet = Sheet.create();
sheet.rules.add({
  main: {
    width: css.pct(100),
    ...css.display.flex,
    ...css.flexDirection.columnReverse,
    rowGap: css.rem(1),
    padding: css.rem(1),
  },
  "main>img": {
    borderRadius: css.rem(1),
    border: css(css.px(4), css.value.solid, css.value.green),
    //border: css(css.px(4), css.value.solid, css.color.hex.ea2d2d),
  
  },
});

console.log(sheet.rules.text)

const main = component.main({
  parent: layout,
  "@_connect": (event) => {
    sheet.use();
  },
  "@_disconnect": (event) => {
    sheet.unuse();
  },
});

export default ({ layout }) => {
  layout.clear(`:not([slot])`);
  layout.clear(`[slot="side"]`);

  component.button("btn.btn-danger", {
    text: "Clear",
    parent: layout,
    slot: "side",
    "@click": (event) => {
      layout.clear(`:not([slot])`);
      layout.clear(`[slot="side"]`);
    },
  });

  /* Use Object.keys to avoid strings  */
  Object.keys({
    handle: "",
    sprocket: "",
    bevel: "",
    decor: "",
    mirror: "",
    engine: "",
  }).forEach((n) =>
    component.img({ src: `${use.meta.base}/images/low/${n}.jpg`, parent: main })
  );

  layout.append(main);
  toTop(main);
};
