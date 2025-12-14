/*
/sheet/static.test.js
*/


import { sheets } from "./sheets.js";

//console.log('sheets:', sheets)////

const { component, Sheet } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear(":not([slot])");

  const sheet = Sheet.create(sheets.base, {}, { foo: 42 }).use();
  

  //console.log("css:", sheets.base); ////
  //console.log("css:", sheet.text); ////
  //console.log("css:", sheet.rules.text); ////



  console.log("detail:", sheet.detail); ////

  component.menu(
    {
      parent: frame,
      "on.click": (event) => {
        if (event.target._action) {
          event.target._action();
        }
      },
    },
    component.button("base", {
      text: "Clear",
      _action: () => sheet.rules.clear(),
    }),
    component.button({
      text: "Unuse",
      _action: () => sheet.unuse(),
    }),
    component.button(
      {
        text: "Remove",
      },
      function () {
        this._action = () => this.parent.remove();
      }
    )
  );
};
