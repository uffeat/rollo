/*
/invalid.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Sheet, css, rule, scope } = await use("@/sheet");

export default (parcel, sheets) => {
  layout.clear(":not([slot])");

  const sheet = Sheet.create().use();

  try {
    sheet.rules.add({
      h1: { bad: "pink" },
    });
  } catch (error) {
    component.p({ 
      parent: layout, 
      text: `Error `,
      padding: css.rem(1),
      ...css.marginLeft.auto
     },
     component.span({
      text: error.message,
      color: css.__.bsDanger,

    })
    
    
    
    );
  }
};
