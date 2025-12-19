/*
/tools/element.test.js
*/

const { frame } = await use("@/frame/");
const { element } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  const button = element.button(
    "btn btn-primary",
    { 
      parent: frame, 
      __ding: '4px',
      'data.dong': 'DONG',
      "on.click.once": (event) => console.log("Clicked!") },
    element.span({ "[foo]": true }, "Button"),
    function() {
      console.log(this)
    }
  );
};
