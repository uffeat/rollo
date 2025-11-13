/*
invalid.js
*/

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default ({ Sheet, css }) => {
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
