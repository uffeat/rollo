/*
/sheet/css.test.js
*/

const { component, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear(":not([slot])");

  const container = component.div(
    { parent: frame },
    component.p({}, "Hi!"),
    function () {
    /* NOTE This is the cannonical Rollo way of implementing small scoped 
    light-DOM constructed sheets:
    - Use css tag to keep SFC without strain on import engine.
    - Do it in hook, so that css can access uid.
    - Call 'use' immediately.
    - Bind sheet enabled state to component lifecycle (faster and cheaper 
      than use/unuse). 

    A few potential drawbacks:
    - Pressure on document.adoptedStyleSheets.
    - FOUC risk.
    - Auto-complete etc. not as good as in native css.

    The solid non-SFC alternative is: await use('/my_sheet.css')
    */

      const sheet = css`
        [uid="${this.uid}"] {
          color: green;
          background-color: linen;
        }
      `.use();

      this.on._connect((event) => sheet.enable());
      this.on._disconnect((event) => sheet.disable());
    }
  );
};
