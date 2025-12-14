/*
/component/hook.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");


export default async () => {
  frame.clear(":not([slot])");

  const button = component
    .button("btn.btn-success", {
      text: "Button",
      parent: frame,
    })
    .hook(function () {
      this.on.click = (event) => {
        console.log("Clicked");
      };
    });

    console.log("Button:", button);

  
};
