/* 
/images.test.js
Tests scroll/overflow/flex behavior.
*/

const { component, Sheet, css, toTop } = await use("@/rollo/");




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

console.log(sheet.rules.text);



export default async () => {
  const { frame } = await use("@/frame/");
  frame.clear(`:not([slot])`);
  frame.clear(`[slot="side"]`);

  const main = component.main({
  parent: frame,
  "on._connect": (event) => {
    sheet.use();
  },
  "on._disconnect": (event) => {
    sheet.unuse();
  },
});

  component.button("btn.btn-danger", {
    text: "Clear",
    parent: frame,
    slot: "side",
    "on.click": (event) => {
      frame.clear(`:not([slot])`);
      frame.clear(`[slot="side"]`);
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

  frame.append(main);
  toTop(main);
};
