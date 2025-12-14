/*
/component/on/once.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
    "on.click.once": (event) => {
      console.log("Clicked");
      if (event.target.detail.clicked) {
        console.error("'once' does not work!");
      }
      event.target.detail.clicked = true;
    },
  });

  component.button(
    "btn.btn-primary",
    {
      text: "Button",
      parent: frame,
    },
    function () {
      this.on.click({ once: true }, (event) => {
        console.log("Clicked");
        if (this.detail.clicked) {
          console.error("'once' does not work!");
        }
        this.detail.clicked = true;
      });
    }
  );
};
