/*
/on/once.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
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
      parent: layout,
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
