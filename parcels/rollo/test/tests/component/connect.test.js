/*
/component/connect.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
   
  });

  button.$.effects.add(
    (change) => {
      console.log("change:", change);
    },
    { run: false },
   
  );

  button.parent = frame

  button.remove()

  button.state.update({foo: 42})



  console.log("button:", button);
};
