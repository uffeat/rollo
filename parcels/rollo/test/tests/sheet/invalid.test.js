/*
/sheet/invalid.test.js
*/


import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, rule, scope } from "@/sheet/sheet.js";

export default () => {
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
