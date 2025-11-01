/*
dsl.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default ({ Sheet, assets, css }) => {
  const sheet = Sheet.create().use(document);


  //const id = crypto.randomUUID();
   const id = 'test';


  sheet.rules.add({
    [`#${id}`]: {
      ...css.display.flex,
      width: css.rem(3),
      height: css.rem(4),
      backgroundColor: css.color.hex.ea2d2d,
      border: css(css.px(4), css.value.solid, css.value.green),
    }
  });

  //console.log("text:", sheet.rules.text); ////

  component.div({ parent: layout, id });
};
