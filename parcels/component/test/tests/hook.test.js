/*
/hook.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");


export default async () => {
  layout.clear(":not([slot])");

  const button = component
    .button("btn.btn-success", {
      text: "Button",
      parent: layout,
    })
    .hook(function () {
      this.on.click = (event) => {
        console.log("Clicked");
      };
    });

    console.log("Button:", button);

  
};
