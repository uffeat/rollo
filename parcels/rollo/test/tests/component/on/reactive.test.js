/*
/component/on/reactive.test.js
*/


const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  /* Inside update */
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
  });

 
  /* Effect to ensure only 1 click handler */
  button.$.effects.add(
    (change, message) => {
      //console.log("change:", change); ////
      //console.log("message:", message); ////
      if (++message.detail.data.count > message.detail.data.max) {
        const handler = change["on.click"];
        button.on.click.unuse(handler);
      }
    },
    { run: false, data: { count: 0, max: 1 } },
    ["on.click"]
  );

  button.$({ "on.click": (event) => console.log("Clicked") });

  button.$["on.click"] = (event) => console.log("Should never run!");
};
