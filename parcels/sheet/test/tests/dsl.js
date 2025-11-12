/*
dsl.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");


export default ({ Sheet, assets, css, scope }) => {
  layout.clear(":not([slot])");
  
  const sheet = Sheet.create().use(document);




  const element = component.div({ parent: layout }, component.p({}, 'Hi!'));
 


  sheet.rules.add({
    [scope(element)]: {
      ...css.display.flex,
      width: css.rem(3),
      height: css.rem(4),
      backgroundColor: css.color.hex.ea2d2d,
      border: css(css.px(4), css.value.solid, css.value.green),
    }
  });

  //console.log("text:", sheet.rules.text); ////

  
};
